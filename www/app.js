
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

var circs

function setup(){

    circs = g.group()

    g.state = play
}

g.pointer.tap = () => {

    makeCirc(g.pointer.x, g.pointer.y)
}

let randCol = () => {
    let hex = '#'

    for(var i = 0; i < 6; i++){
        hex += g.randomInt(0, 8)
    }

    return hex
}

let makeCirc = (x, y) => {

    let circ = g.circle(
        g.randomInt(15, 35),
        randCol()
    )

    circ.setPosition(x, y)

    circ.setPivot(1, 1)

    g.breathe(circ, 2, 2, 20)

    circ.vx = g.randomInt(-10, 10)
    circ.vy = g.randomInt(-10, 10)

    circs.addChild(circ)
}

function play() {

    circs.children.forEach(circ => {

        let col = g.contain(circ, g.stage, true)

        circ.rotation += 0.2
        g.move(circ)
    })

}