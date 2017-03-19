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
let balls, bigBall
let speedX = 5,
    speedY = 5
let size = 50

// -------------
    g.start()
// -------------

function setup(){

    balls = g.group()

    bigBall = makeBall(size * 2, "red", "black", 2,_WIDTH/2, _HEIGHT/2 )

    socket.emit('makeConnection', 'host')

    g.state = play
}

// -------------

socket.on('stick', (data)=>{
    
    console.log('stick')
    console.log(data)
})

socket.on('a', ()=>{

    console.log('a')

    let ball = makeBall(size, 'green', 'black', 2, _WIDTH/2, _HEIGHT/2)
    balls.addChild(ball)
})

socket.on('x', ()=>{

    console.log('x')

    let ball = makeBall(size, 'blue', 'black', 2, _WIDTH/2, _HEIGHT/2)
    balls.addChild(ball)
})

socket.on('y', ()=>{

    console.log('y')

    let ball = makeBall(size, 'yellow', 'black', 2, _WIDTH/2, _HEIGHT/2)
    balls.addChild(ball)
})

socket.on('b', ()=>{

    console.log('b')

    let ball = makeBall(size, 'red', 'black', 2, _WIDTH/2, _HEIGHT/2)
    balls.addChild(ball)
})

function makeBall(size, color, lineColor, lineWidth, x, y){

    let ball = g.circle(size, color, lineColor, lineWidth, x, y)

    ball.vx = speedX
    ball.vy = speedY

    ball.mass = 1

    setTimeout(function(){

        //g.remove(ball)

    }, 2500)

    return ball
}

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}')

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function play() {

    g.multipleCircleCollision(balls.children)

    balls.children.forEach(ball => {

        g.contain(ball, g.stage, true)

        if(g.hit(ball, bigBall)){
            g.movingCircleCollision(ball, bigBall)
        }

        g.move(ball)
    })

    g.contain(bigBall, g.stage, true)
    g.move(bigBall)

}
