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
let size = _WIDTH * 0.12 // 75
let stickSize = _WIDTH * 0.35 // 250
var stickJob    

let btnStart
let buttonCenterPlaceholder

let midline

// -------------
    g.start()
// -------------

function setup(){

    stick = g.circle(stickSize, 'grey', 'black', 0, 20, _HEIGHT/2 - stickSize/2)
    // stickPlaceholder = g.circle(size/2, 'grey', 'black', 0, _WIDTH - size * 2, _HEIGHT / 2 - size / 4)
    g.makeInteractive(stick)

    buttons = g.group()

    buttonCenter = g.circle(size/2, 'grey', 'black', 0, _WIDTH - size * 2, _HEIGHT / 2 - size / 4)
    buttonCenterPlaceholder = g.circle(size/2, 'grey', 'black', 0, buttonCenter.x, buttonCenter.y)

    btnA = makeButton(size, 'green', buttonCenter.x, buttonCenter.y, 'A')
    btnX = makeButton(size, 'blue', buttonCenter.x, buttonCenter.y, 'X')
    btnY = makeButton(size, 'yellow', buttonCenter.x, buttonCenter.y, 'Y')
    btnB = makeButton(size, 'red', buttonCenter.x, buttonCenter.y, 'B')
    
    btnStart = makeStartButton()

    //midline = g.rectangle(2, _HEIGHT, 'black', 0, 0, _WIDTH/2, 0)

    socket.emit('makeConnection', 'client')
    
    g.state = play
}



function makeStartButton(){


    let width = _WIDTH * 0.14,
        height = _WIDTH * 0.07

    btnStart = g.rectangle(width, height, 'darkgrey', 'black', 3, (_WIDTH/2) - (width/2), _HEIGHT - height)
    btnStartText = g.text('START', '24px puzzler', 'black', btnStart.x, btnStart.y)
    btnStart.putCenter(btnStartText)
    g.makeInteractive(btnStart)
    btnStart.tap = () => {

        stick.draggable = !stick.draggable
        buttonCenter.draggable = !buttonCenter.draggable
        
        if(g.hit(buttonCenter, buttonCenterPlaceholder))
            buttonCenterPlaceholder.putCenter(buttonCenter)

        socket.emit('start')
    }

}

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}') 

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function makeButton(size, color, x, y, text){

    let btn = g.circle(size, color, 'black', 0, x, y)
    btn.text = g.text(text, '48px puzzler', 'black')
    btn.setPivot(0.5, 0.5)
    g.makeInteractive(btn)

    btn.tap = () => {
        
        socket.emit(text)
    }

    return btn
}

function sendStick(){

    let forceX = g.pointer.x - stick.x - stick.halfWidth
    let forceY = g.pointer.y - stick.y - stick.halfHeight

    socket.emit('stick', {x:forceX, y:forceY})
}

function checkStick(){
    if(stick.pressed){
        if(!stickJob){
            stickJob = setInterval(sendStick, 100)
        }        
    } else {
        if(stickJob){
            clearInterval(stickJob)
            stickJob = undefined
            socket.emit('stick', {x:0, y:0})
        }
    }
}

function moveButtons(){

    let btnOffset = 0//size/4

    buttonCenter.putBottom(btnA, 0, -btnOffset)
    btnA.putCenter(btnA.text)
    buttonCenter.putLeft(btnX, btnOffset)
    btnX.putCenter(btnX.text)
    buttonCenter.putTop(btnY, 0, btnOffset)
    btnY.putCenter(btnY.text)
    buttonCenter.putRight(btnB, -btnOffset)
    btnB.putCenter(btnB.text)

    //stick.putCenter(stickCenter)
}

function play() {

    checkStick()

    moveButtons()

}
