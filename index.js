const PORT = 1337

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use('/', express.static('game'))
app.use('/gamepad/', express.static('gamepad'))

io.on('connection', function (socket) {
  console.log('Socket connected')

  socket.on('disconnect', function () {
    console.log('Socket disconnected')
  })
})

http.listen(PORT, function () {
  console.log('MobiPad started on localhost:' + PORT + ' at: ' + new Date().toTimeString())
})
