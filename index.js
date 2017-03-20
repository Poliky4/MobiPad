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

io.on('connection', function(socket){

	let origin
	
	console.log('Socket connected \t#' + socket.id)

	socket.on('makeConnection', ($origin) =>{

		origin = $origin

		if	(origin == 'host') 		hosts.push(socket)
		if	(origin == 'client')	clients.push(socket)

		console.log('hosts: ' + hosts.length)
		console.log('clients: ' + clients.length)
	})

	socket.on('sync', (indata) => {
		let data = indata
		console.log('sync: ', data)

		hosts.forEach(host=> {
			host.emit('sync', data)
		})

	})

	// socket.on('clientSync', data => {

	// 	// will be *your* host and not all
	// 	hosts.forEach(host=> {
	// 		host.emit('stick', data)
	// 	})
	// })

	socket.on('stick', (data)=>{

		hosts.forEach(host=> {
			host.emit('stick', data)
		})
	})
	socket.on('a', ()=>{

		hosts.forEach(host=> {
			host.emit('a')
		})
	})
	socket.on('x', ()=>{

		hosts.forEach(host=> {
			host.emit('x')
		})
	})
	socket.on('y', ()=>{

		hosts.forEach(host=> {
			host.emit('y')
		})
	})
	socket.on('b', ()=>{

		hosts.forEach(host=> {
			host.emit('b')
		})
	})
	socket.on('start', ()=>{

		hosts.forEach(host=> {
			host.emit('start')
		})
	})

	socket.on('disconnect', function(){
			
		console.log('Socket disconnected \t#' + socket.id)
		if(origin == 'host'){
			hosts.splice(hosts.indexOf(socket), 1)
		}
		else if(origin == 'client'){
			clients.splice(hosts.indexOf(socket), 1)
		}

		console.log('hosts: ' + hosts.length)
		console.log('clients: ' + clients.length)
	})
})


http.listen(PORT, function () {
	console.log('MobiPad started on localhost:' + PORT + ' at: '+ new Date().toTimeString())
})
