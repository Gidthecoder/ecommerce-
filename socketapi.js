const io = require("socket.io")();

const socketapi = {
	io: io
};

io.on("connection", function(socket) {
	console.log('a user connected');
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg)
		console.log(msg)
	})
	
})

module.exports = socketapi;