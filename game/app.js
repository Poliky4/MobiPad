const _FPS = 30
const _WIDTH = window.innerWidth || 800
const _HEIGHT = window.innerHeight || 600

const _V = true // verbose, devtime so true :p

//let thingsToLoad = []
// let g = hexi(_WIDTH, _HEIGHT, setup, thingsToLoad, load)
var g = hexi(_WIDTH, _HEIGHT, setup)

if (_V) console.log('canvas size: ' + _WIDTH + 'x' + _HEIGHT)

g.scaleToWindow()

if (_V) console.log('canvas size: ' + _WIDTH + 'x' + _HEIGHT)

g.backgroundColor = '#EDE682'
g.fps = _FPS

g.start()

function load(){

    //Display the file currently being loaded
    console.log('loading: ${g.loadingFile}') 

    //Display the percentage of files currently loaded
    console.log('progress: ${g.loadingProgress}')

    g.loadingBar()
}

function setup(){

    g.state = play
}

g.pointer.tap = function() {

}


function play() {

}
