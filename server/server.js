const express = require('express');
const path    = require('path');
const http    = require('http');
const socketIO  = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// socket.emit from Admin to new User text welcome to the chat app
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

	//everyone will see new user joined except new user
	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));	

	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		// every one will get this message.
		io.emit('newMessage',generateMessage(message.from, message.text));

		//With this the sender will not see the message, but everyone else will receive the message.
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	 socket.on('disconnect', () => {
			console.log('User disconnected.');
	});
});

server.listen(port, ()=>{
	console.log(`Server is up on port ${port}`);
})