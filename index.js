const PORT = 1337

const express = require('express')
const io = require('socket.io')

const app = express()
const http = require('http').Server(app)

app.use(express.static('www'))

http.listen(PORT, function () {
	console.log('Controller running on port ' + PORT)
})