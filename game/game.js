const _FPS = 30
const _WIDTH = window.innerWidth || 800
const _HEIGHT = window.innerHeight || 600

//let thingsToLoad = []
// let g = hexi(_WIDTH, _HEIGHT, setup, thingsToLoad, load)
var g = hexi(_WIDTH, _HEIGHT, setup)

g.scaleToWindow()
g.backgroundColor = '#EDE682'
g.fps = _FPS

var socket = io()

// globals
let balls = [], bigBall, ball
let speedX = 5,
    speedY = 5
let size = 50
let ballLifeTimeMS = 5000

let paused = false

// -------------
    g.start()
// -------------

function setup(){

    //balls = g.group()

    bigBall = g.circle(size * 2, "red", "black", 2,_WIDTH/2, _HEIGHT/2 )
    bigBall.mass = 10
    bigBall.setPivot(0.5, 0.5)

    socket.emit('makeConnection', 'host')

    g.state = play
}

// -------------

socket.on('start', () => {
    if(paused){
        g.resume()
        paused = false
    } else {
        g.pause()
        paused = true
    }
})

socket.on('stick', (data)=>{
    
    //console.log('stick')
    //console.log(data)

    bigBall.vx = data.x * 0.2
    bigBall.vy = data.y * 0.2

})

socket.on('A', ()=>{

    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('X', ()=>{

    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('Y', ()=>{

    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('B', ()=>{

    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

function makeBall(size, color, lineColor, lineWidth, x, y){

    var ball = g.circle(size, color, lineColor, lineWidth, x, y)

    ball.mass = 1
    ball.setPivot(0.5, 0.5)

    g.shoot(bigBall, bigBall.rotation, bigBall.halfWidth, bigBall.halfHeight, g.stage, 7, balls, () => ball)
    // g.shoot(bigBall, bigBall.rotation, bigBall.halfWidth, -100, g.stage, 7, balls, () => ball)

    setTimeout(()=>{

        //g.remove(balls.splice(balls.indexOf(ball), 1)[0])

    }, ballLifeTimeMS)
}

function getRotation(obj){
        
    let prevObj = {}

    prevObj.x = obj._previousX
    prevObj.y = obj._previousY
    prevObj.height = obj.height
    prevObj.width = obj.width
    prevObj.anchor = obj.anchor
    
    return g.angle(prevObj, obj)

}

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}')

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function play() {

    g.multipleCircleCollision(balls)

    for(let i in balls){
        let ball = balls[i]

        g.contain(ball, g.stage, true)


        g.move(ball)
        if(g.hit(ball, bigBall)){
            g.remove(balls.splice(balls.indexOf(ball), 1)[0])

        }
    }

    g.contain(bigBall, g.stage)
    g.move(bigBall)

    let rotation = getRotation(bigBall)
    if(rotation != 0)
        bigBall.rotation = rotation

    
}
