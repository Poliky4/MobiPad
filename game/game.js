const _FPS = 30
const _WIDTH = window.innerWidth || 800
const _HEIGHT = window.innerHeight || 600

const gameWidth = 1000
const gameHeight = 1000

//let thingsToLoad = []
// let g = hexi(_WIDTH, _HEIGHT, setup, thingsToLoad, load)
var g = hexi(_WIDTH, _HEIGHT, setup)

g.scaleToWindow()
g.backgroundColor = '#EDE682'
g.fps = _FPS

scaleToWindow(document.querySelector("#ui"))
window.addEventListener("resize", function(event){
  scaleToWindow(document.querySelector("#ui"))
})

var socket = io()

// globals

let hostId = '-'
let hostText = {}
let gamepadsText = {}

let balls = [], bigBall, ball
let speedX = 5,
    speedY = 5
let size = 50
let ballLifeTimeMS = 10000

let gamepads = []

let world
let camera

// Keys
let keySpace = g.keyboard(32)
let keyESC = g.keyboard(27)

let keyW = g.keyboard(87)
let keyA = g.keyboard(65)
let keyS = g.keyboard(83)
let keyD = g.keyboard(68)

let paused = false

// -------------
    g.start()
// -------------

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}')

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function setup(){

    //balls = g.group()

    bigBall = g.circle(size * 2, "red", "black", 2,_WIDTH/2, _HEIGHT/2 )
    bigBall.mass = 10
    bigBall.setPivot(0.5, 0.5)
    g.arrowControl(bigBall, 5)
    bigBall.layer = 1

    hostText.text = g.text('Host id: ', '18px puzzler', 10, 20)
    hostText.value = g.text('-', '18px puzzler', 0, 0)
    hostText.text.putRight(hostText.value)
    
    gamepadsText.text = g.text('Gamepads: ', '18px puzzler', 0, 0)
    hostText.text.putBottom(gamepadsText.text, 10)
    gamepadsText.value = g.text('-', '18px puzzler', 0, 0)
    gamepadsText.text.putRight(gamepadsText.value)

    socket.emit('makeConnection', 'host')

    let world = g.rectangle(gameWidth, gameHeight, 'darkgreen', 'black', 2, 0, 0)
    world.layer = -1

    camera = g.worldCamera(g.stage, gameWidth, gameHeight)//, g.canvas)
    // camera = g.worldCamera(bigBall, gameWidth, gameHeight, g.canvas)
    // camera.centerOver(bigBall)

    g.state = play
}

// -------------

socket.on('hostId', (id) => {
  
    hostId = id
    console.log('I am #' + id)
})

socket.on('gamepadConnect', () => {
  
    console.log('Gamepad connected!')
    
    gamepads.push({})
})
socket.on('gamepadDisconnect', () => {
  
    console.log('Gamepad disconnected!')
    
    gamepads.shift()
})

// Keybindings

keySpace.press = () => {
    
    shootBalls('pink')
}
keyESC.press = () => {
    
    pause()
}



keyW.press = () => {
    
    bigBall.vy = -speedY
}
keyW.release = () => {
    
    bigBall.vy = 0
}

keyA.press = () => {

    bigBall.vx = -speedX
}
keyA.release = () => {

    bigBall.vx = 0
}

keyS.press = () => {

    bigBall.vy = speedY
}
keyS.release = () => {

    bigBall.vy = 0
}

keyD.press = () => {

    bigBall.vx = speedX
}
keyD.release = () => {

    bigBall.vx = 0
}

// /Keybindings

socket.on('start', () => {
    
    pause()
})

socket.on('stick', (data)=>{
    
    //console.log('stick')
    //console.log(data)

    console.log('stick')

    bigBall.vx = data.x * 0.2
    bigBall.vy = data.y * 0.2

})



socket.on('A', ()=>{

    shootBalls('green')
})

socket.on('X', ()=>{

    shootBalls('blue')
})

socket.on('Y', ()=>{

    shootBalls('yellow')
})

socket.on('B', ()=>{
    shootBalls('red')
})

function pause(){
    if(paused){
        g.resume()
        paused = false
    } else {
        g.pause()
        paused = true
    }
}

function shootBalls(color){

    makeBall(size, color, 'black', 2, _WIDTH/2, _HEIGHT/2 + 50)
    makeBall(size, color, 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, color, 'black', 2, _WIDTH/2, _HEIGHT/2 - 50)
}

function makeBall(size, color, lineColor, lineWidth, x, y){

    if(paused) return

    var ball = g.circle(size, color, lineColor, lineWidth, x, y)

    ball.mass = 1
    ball.setPivot(0.5, 0.5)

    g.shoot(bigBall, bigBall.rotation, bigBall.halfWidth * 1.5, bigBall.halfHeight * 1.5, g.stage, 7, balls, () => ball)
    // g.shoot(bigBall, bigBall.rotation, bigBall.halfWidth, -100, g.stage, 7, balls, () => ball)

    setTimeout(()=>{

        removeBall(ball)

    }, ballLifeTimeMS)
}

function removeBall(ball){

    if(!ball || balls.length == 0)
        return

    ball = balls.splice(balls.indexOf(ball), 1)[0]

    if(!ball){
        ball = balls.pop()
        console.log('pop')
    }
        
    g.remove(ball)
}

function getRotation(obj){
        
    let prevObj = {}

    prevObj.x = obj._previousX
    prevObj.y = obj._previousY
    prevObj.height = obj.height
    prevObj.width = obj.width
    prevObj.anchor = obj.anchor
    
    if(obj.x == prevObj.x && obj.y == prevObj.y){

        return bigBall.rotation
    }

    return g.angle(prevObj, obj)
}



function play() {

    g.multipleCircleCollision(balls)

    for(let i in balls){
        let ball = balls[i]

        // g.contain(ball, g.stage, true)
        g.contain(ball, {x:0, y:0, width:gameWidth, height:gameHeight}, true)

        g.move(ball)

        if(g.hit(ball, bigBall)){
            g.circleCollision(ball, bigBall, true)
            //removeBall(ball)
        }
    }

    g.contain(bigBall, {x:0, y:0, width:gameWidth, height:gameHeight})
    g.move(bigBall)
    camera.follow(bigBall)

    bigBall.rotation = getRotation(bigBall)

    hostText.value.text = hostId
    gamepadsText.value.text = gamepads.length
}
