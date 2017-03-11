
const _FPS = 30

let thingsToLoad = []

// let g = hexi(512, 512, setup, thingsToLoad, load)
let g = hexi(512, 512, setup)
g.scaleToWindow()
g.fps = _FPS
g.start()

function load(){

    //Display the file currently being loaded
    console.log(`loading: ${g.loadingFile}`); 

    //Display the percentage of files currently loaded
    console.log(`progress: ${g.loadingProgress}`);

    g.loadingBar()
}

function setup(){

    g.state = play
}

g.pointer.tap = function() {

}


function play() {

}
