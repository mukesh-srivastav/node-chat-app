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

socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My Current Location</a>');

	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);

	jQuery('#messages').append(li);
});

// For sending the message from browser form.
jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();

	var messageTextBox =  $('[name=message]');
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextBox.val()
	}, function () {
		messageTextBox.val('');
	});
});


//Share location
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	//if browser is not enabled for geolocation then alert.
	if(!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending Location.....');

	//ask for location access permission, 
	//if allow send the location to server 
	//else reject with alert message 
	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		})
	}, function () {
		locationButton.attr('disabled', 'disabled').text('Send Location');
		alert('Unable to fetch location');
	});
});