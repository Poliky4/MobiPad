const PORT = 1337

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use('/', express.static('game'))
app.use('/gamepad/', express.static('gamepad'))

// globals
let stuff

io.on('connection', function(socket){

	console.log('New socket #' + socket.id)

	socket.on('tap', function (x, y) {

		console.log('tap (', x, y, ')')

		socket.emit('tapShake', 'wut')
	})

	socket.on('disconnect', function(){
			
		console.log('Disconnected socket #' + socket.id)
	})
})

http.listen(PORT, function () {
	console.log('MobiPad started on localhost:' + PORT + ' at: '+ new Date().toTimeString())
})
