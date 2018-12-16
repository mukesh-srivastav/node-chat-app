const express = require('express');
const path    = require('path');
const http    = require('http');
const socketIO  = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname,"../public");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	// when user joins : server listener for join
	socket.on('join', (params, callback) => {
		
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and Room are required.');
		}

		socket.join(params.room);
		//Remove the user from other chatrooms
		users.removeUser(socket.id);
		//add to the requsted room.
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
		// socket.emit from Admin to new User text welcome to the chat app
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

		//everyone will see new user joined except new user
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
	});

	socket.on('createMessage', (message, callbackAcknowldegment) => {
		console.log('createMessage', message);
		// every one will get this message.
		io.emit('newMessage',generateMessage(message.from, message.text));
		callbackAcknowldegment("Got it");
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	 socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});

server.listen(port, ()=>{
	console.log(`Server is up on port ${port}`);
})