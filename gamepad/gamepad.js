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
var rtc = communications.getRTC(true)

console.log('rtc')
console.log(rtc)
console.log('rtc')


// Global variables
let stick, stickCenter, btnCenter, btnA, btnX, btnY, btnB
let btnConnect
let btnStart
let buttonCenterPlaceholder

let size = _WIDTH * 0.12
let stickSize = _WIDTH * 0.35
let shadowColor = 'rgba(255, 255, 255, 0.7)'

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

socket.on('answer', sdp => {
    
    console.log('Answer!')
    console.log(sdp)

    rtc.setRemoteDescription(new RTCSessionDescription(sdp))
})

socket.on('gamepadConnect', () => {

    console.log('Connected!')

    document.getElementById('hostId').style.visibility = "hidden"
})

function setup(){

    stick = g.circle(stickSize, 'grey', 'black', 0, 20, _HEIGHT/2 - stickSize/2)
    // stickPlaceholder = g.circle(size/2, 'grey', 'black', 0, _WIDTH - size * 2, _HEIGHT / 2 - size / 4)
    g.makeInteractive(stick)

    buttonCenter = g.circle(size/2, 'grey', 'black', 0, _WIDTH - size * 2, _HEIGHT / 2 - size / 4)
    buttonCenterPlaceholder = g.circle(size/2, 'grey', 'black', 0, buttonCenter.x, buttonCenter.y)

    btnA = makeButton(size, 'green', 0, 0, 0, 'A', 50)
    buttonCenter.addChild(btnA)
    buttonCenter.putBottom(btnA)
    btnX = makeButton(size, 'blue', 0, 0, 0, 'X', 50)
    buttonCenter.addChild(btnX)
    buttonCenter.putLeft(btnX)
    btnY = makeButton(size, 'yellow', 0, 0, 0, 'Y', 50)
    buttonCenter.addChild(btnY)
    buttonCenter.putTop(btnY)
    btnB = makeButton(size, 'red', 0, 0, 0, 'B', 50)
    buttonCenter.addChild(btnB)
    buttonCenter.putRight(btnB)
    
    let startBtnSize = size/1.5
    btnStart = makeButton(startBtnSize, 'grey', 2, _WIDTH/2 - startBtnSize, _HEIGHT - startBtnSize - 30, ' Move\nButtons', 16)
    btnStart.tap = () => {

        stick.draggable = !stick.draggable
        buttonCenter.draggable = !buttonCenter.draggable
        
        if(g.hit(buttonCenter, buttonCenterPlaceholder))
            buttonCenterPlaceholder.putCenter(buttonCenter)

        //socket.emit('start', hostId)
    }

    btnConnect = makeButton(startBtnSize, 'grey', 2, 0, 0, 'Connect', 16)
    btnStart.putRight(btnConnect)
    btnConnect.tap = () => {
        
        let hostIdBox = document.getElementById('hostId')

        if(hostIdBox.style.visibility != 'hidden')
            socket.emit('connectGamepad', hostIdBox.value, rtc.localDescription)
        else
            hostIdBox.style.visibility = 'visible'
    }

    socket.emit('makeConnection', 'client')
    
    g.state = play
}

function makeButton(size, color, lineWidth, x, y, text, textSize){

    let btn = g.circle(size, color, 'black', lineWidth, x, y)
    btn.setPivot(0.5, 0.5)
    g.makeInteractive(btn)

    if(!text)
        return btn

    let btnTextShadow = g.text(text, textSize + 'px puzzler', shadowColor)
    btn.addChild(btnTextShadow)
    btn.putCenter(btnTextShadow, 2, 2)
    
    let btnText = g.text(text, textSize + 'px puzzler', 'black')
    btn.addChild(btnText)
    btn.putCenter(btnText)

    btn.tap = () => {
        
        socket.emit(text)
    }

    return btn
}

function sendStick(){

    let forceX = g.pointer.x - stick.x - stick.halfWidth
    let forceY = g.pointer.y - stick.y - stick.halfHeight

    console.log('stick')
    socket.emit('stick', {x:forceX, y:forceY})
}

function checkStick(){
    if(stick.pressed){
        if(!stick.stickJob){
            stick.stickJob = setInterval(sendStick, 100)
        }        
    } else {
        if(stick.stickJob){
            clearInterval(stick.stickJob)
            stick.stickJob = undefined
            socket.emit('stick', {x:0, y:0})
            rtc.dataChannel.send([{'hm':'huh'}])
        }
    }
}


function play() {

    checkStick()

}