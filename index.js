const PORT = 1337

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use('/', express.static('game'))
app.use('/gamepad/', express.static('gamepad'))

// globals
let hosts = [],
	clients = []

let hostIds = 0 

io.on('connection', function(socket){

	// Connection events

	let origin
	socket.on('makeConnection', ($origin) =>{

		origin = $origin

		console.log('New', origin, '#' + socket.id)

		if	(origin == 'host') {

			socket.hostId = hostIds++
			socket.gamepads = []
			
			socket.emit('hostId', socket.hostId)

			hosts.push(socket)
		}
		else if	(origin == 'client'){
			
			clients.push(socket)
		}
	})

	socket.on('connectGamepad', (id) => {

		console.log('Gamepad trying to connect')

		let connected = false

		hosts.forEach(host => {
			if(host.hostId == id){

				console.log('host found!')

				if(host.gamepads.length < 4){

					host.gamepads.push(socket)
					socket.host = host

					console.log('gamepad connected')

					host.emit('gamepadConnected', {playerNumber:host.gamepads.length})
					socket.emit('gamepadConnected', {playerNumber:host.gamepads.length})

					connected = true
				}
			}
		})		

		socket.emit('gamepadConnected', connected)
	})

	// Gamepad events

	socket.on('stick', (data)=>{

		console.log('stick')
		socket.host.emit('stick', data)
	})
	socket.on('A', ()=>{

		socket.gamepads.forEach(gamepad=> {
			host.emit('A')
		})
	})
	socket.on('X', ()=>{

		socket.gamepads.forEach(gamepad=> {
			host.emit('X')
		})
	})
	socket.on('Y', ()=>{

		socket.gamepads.forEach(gamepad=> {
			host.emit('Y')
		})
	})
	socket.on('B', ()=>{

		socket.gamepads.forEach(gamepad=> {
			host.emit('B')
		})
	})
	socket.on('start', ()=>{

		socket.gamepads.forEach(gamepad=> {
			host.emit('start')
		})
	})

	// Gamepad events

	socket.on('disconnect', function(){
			
		console.log(origin, '#' + socket.id, 'disconnected')
		if(origin == 'host'){
			hosts.splice(hosts.indexOf(socket), 1)
		}
		else if(origin == 'client'){
			clients.splice(hosts.indexOf(socket), 1)
		}
	})
})


http.listen(PORT, function () {
	console.log('MobiPad started on localhost:' + PORT + ' at: '+ new Date().toTimeString())
})

function sendToGamepads(host, event, data){
	host.gamepads.forEach(gamepad => {
		gamepad.emit(event, data)
	})
}

function sendToHost(host, event, data){
	
	try{
		
		host.emit(event, data)
	
	} catch(err) {

		console.log(err)
		return false
	}

	return true
}