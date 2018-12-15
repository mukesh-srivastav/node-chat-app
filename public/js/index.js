var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected to server');
});

socket.on('newMessage', function (message) {
	console.log('new message', message);

	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);

	jQuery('#messages').append(li);
});

//Check for server acknowledgement from server
// socket.emit('createMessage', {
// 	from: "Anne",
// 	text: "This is me",
// }, function(data) {
// 	console.log("Server acknowledgement : ", data);
// });

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function () {

	});
});