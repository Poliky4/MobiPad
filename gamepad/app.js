const _FPS = 30
const _WIDTH = window.innerWidth || 800
const _HEIGHT = window.innerHeight || 600

//let thingsToLoad = []
// let g = hexi(_WIDTH, _HEIGHT, setup, thingsToLoad, load)
var g = hexi(_WIDTH, _HEIGHT, setup)

g.scaleToWindow()
g.backgroundColor = '#a0a0a0'
g.fps = _FPS

var socket = io()

// Global variables
let balls, bigBall, gameScene
let speedX = 5
let speedY = 5
let size = 50

// --------------------------------
// --------------       ------------------
                g.start()
// --------------       ------------------
// --------------------------------

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}') 

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function setup(){

    //gameScene = g.group()

    balls = g.group()

    bigBall = makeBall(size * 2, "red", "black", 2,_WIDTH/2, _HEIGHT/2 )
    bigBall.mass = 9
    bigBall.friction = 0

    g.state = play
}


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


g.pointer.tap = function() {

    let x = g.pointer._x,
        y = g.pointer._y

    let ball = makeBall(size, 'green', 'black', 2, x - size/2, y - size/2)

    balls.addChild(ball)

    console.log('tap (',x, y, ')')
    socket.emit('tap', x, y)

}

function play() {

    g.contain(bigBall, g.stage, true)
    g.multipleCircleCollision(balls.children)

    balls.children.forEach(ball => {

        g.contain(ball, g.stage, true)
        
        if(g.hit(ball, bigBall)){
            g.movingCircleCollision(ball, bigBall)
        }

        g.move(ball)
    })

    g.move(bigBall)

}
