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

    bigBall = g.circle(size * 3, "red", "black", 2,_WIDTH/2, _HEIGHT/2 )
    bigBall.mass = 10

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

socket.on('a', ()=>{

    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('x', ()=>{

    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('y', ()=>{

    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

socket.on('b', ()=>{

    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
    makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
})

function makeBall(size, color, lineColor, lineWidth, x, y){

    var ball = g.circle(size, color, lineColor, lineWidth, x, y)

    ball.mass = 1

    let angle = 4.7

    console.log('angle')

    let previousBigBall = bigBall
    previousBigBall.x = bigBall._previousX
    previousBigBall.y = bigBall._previousY

    // console.log(previousBigBall)
    console.log(g.angle(previousBigBall, bigBall))

    console.log('angle')

    g.shoot(bigBall, angle, bigBall.halfWidth, -100, g.stage, 7, balls, () => ball)

    setTimeout(()=>{

        //g.remove(balls.splice(balls.indexOf(ball), 1)[0])

    }, ballLifeTimeMS)
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
            //g.circleCollision(ball, bigBall, true)
        }
    }

    g.contain(bigBall, g.stage)
    g.move(bigBall)

}
