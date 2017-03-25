const PORT = 1337

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use('/', express.static('game'))
app.use('/gamepad/', express.static('gamepad'))

http.listen(PORT, function () {
	console.log('MobiPad started on localhost:' + PORT + ' at: '+ new Date().toTimeString())
})

// globals
let hosts = [],
	clients = []

// will probably be replaced by db auto id
let hostIds = 0 

io.on('connection', function(socket){

	// Connection events
	socket.on('disconnect', function(){
			
		console.log(socket.role, '#' + socket.id, 'disconnected')

		if(socket.role == 'host'){
			
			hosts.splice(hosts.indexOf(socket), 1)
		}
		else if(socket.role == 'client'){
			
			clients.splice(clients.indexOf(socket), 1)

			sendToHost(socket, 'gamepadDisconnect')
		}
	})

	socket.on('makeConnection', (role) =>{

		socket.role = role

		console.log('New', socket.role, '#' + socket.id)

		if	(socket.role == 'host') {

			socket.hostId = hostIds++
			socket.gamepads = []
			
			socket.emit('hostId', socket.hostId)

			hosts.push(socket)
		}
		else if	(socket.role == 'client'){
			
			clients.push(socket)
		}
	})

	socket.on('connectGamepad', (id) => {

		let host = findHostById(id)

		if(!host)
			return

		host.gamepads.push(socket)
		socket.host = host

		console.log('gamepad connected')

		host.emit('gamepadConnect')
		socket.emit('gamepadConnect')

	})


	// Gamepad events

	socket.on('stick', (data)=>{

		sendToHost(socket, 'stick', data)
	})
	socket.on('A', ()=>{

		sendToHost(socket, 'A')
	})
	socket.on('X', ()=>{

		sendToHost(socket, 'X')
	})
	socket.on('Y', ()=>{

		sendToHost(socket, 'Y')
	})
	socket.on('B', ()=>{

		sendToHost(socket, 'B')
	})
	socket.on('start', ()=>{

		sendToHost(socket, 'start')
	})

	// Gamepad events
})


function findHostById(id){
	for(let i in hosts){
		let host = hosts[i]
		if(host.hostId == id) {
		
			return host
		}
	}

	return undefined		
}

function sendToGamepads(socket, event, data){
		
	try{
	
		socket.host.gamepads.forEach(gamepad => {
			gamepad.emit(event, data)
		})
	} catch(err) {

		// console.log(err)
		console.log('Error sending to gamepads')
		return false
	}

	return true
}

function sendToHost(socket, event, data){
	try{
		
		socket.host.emit(event, data)
	
	} catch(err) {

		// console.log(err)
		console.log('Error sending to host')
		return false
	}

	return true
	
}