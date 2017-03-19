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
let stick, stickCenter, btnCenter, btnA, btnX, btnY, btnB
let buttons
let size = _WIDTH * 0.15 // 75
let stickSize = _WIDTH * 0.35 // 250

// -------------
    g.start()
// -------------

function setup(){

    buttons = g.group()

    buttonCenter = g.circle(size, 'grey', 'black', 0, _WIDTH - size * 2, _HEIGHT / 2 - size / 2)

    stick = g.circle(stickSize, 'grey', 'black', 2, 20, _HEIGHT/2 - stickSize/2)
    stick.setPivot(0.5, 0.5)

    stickCenter = g.circle(stickSize/2, 'darkgrey', 'black', 2, stick.x + stickSize/4, stick.y + stickSize/4)
    stickCenter.setPivot(0.5, 0.5)

    stick.interact = true
    stick.press = function(){

        console.log('stick!')

        let stickX = g.pointer._x,
            stickY = g.pointer._y

        console.log('click: ', stickX, ',', stickY)
        console.log('stick: ', stick.x + stick.width/2, stick.y + stick.height/2)

        let angleFromCenter = g.angle(stick, g.pointer)
        let distFromCenter = g.distance(stick, g.pointer)

        console.log('angleFromCenter: ', angleFromCenter)
        console.log('distFromCenter: ', distFromCenter)

        stickCenter.x = stickX
        stickCenter.y = stickY

        socket.emit('stick', {angle: angleFromCenter, distance: distFromCenter})
    }

    let btnOffset = (size/3)*2

    btnA = makeButton(size, 'green', 'black', 2, buttonCenter.x + btnOffset, buttonCenter.y)
    btnA.setPivot(0.5, 0.5)
    btnA.interact = true
    btnA.press = function(){

        console.log('A!')

        socket.emit('a')
    }

    btnX = makeButton(size, 'blue', 'black', 2, buttonCenter.x, buttonCenter.y - btnOffset)
    btnX.setPivot(0.5, 0.5)
    btnX.interact = true
    btnX.press = function(){

        console.log('X!')

        socket.emit('x')
    }

    btnY = makeButton(size, 'yellow', 'black', 2, buttonCenter.x - btnOffset, buttonCenter.y)
    btnY.setPivot(0.5, 0.5)
    btnY.interact = true
    btnY.press = function(){

        console.log('Y!')

        socket.emit('y')
    }

    btnB = makeButton(size, 'red', 'black', 2, buttonCenter.x, buttonCenter.y + btnOffset)
    btnB.setPivot(0.5, 0.5)
    btnB.interact = true
    btnB.press = function(){

        console.log('B!')

        socket.emit('b')
    }

    socket.emit('makeConnection', 'client')
    
    g.state = play
}

socket.on('sync', (data) => {

    console.log('sync')
    console.log(data)
})

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}') 

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function makeButton(size, color, lineColor, lineWidth, x, y){

    let defaultButton = {
        size, 
    }

    let btn = g.circle(size, color, lineColor, lineWidth, x, y)

    return btn
}

function play() {

    g.contain(stickCenter, stick)

    if(!stick.pressed){
        stickCenter.x = stick.halfWidth + stickCenter.halfWidth/2
        stickCenter.y = stick.halfHeight + stickCenter.halfHeight/2
    }
}
