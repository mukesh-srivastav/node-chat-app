var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected to server');
});

socket.on('newMessage', function (message) {
	console.log(message);
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	//Mustache is templating engine used for showing messages
	var template = jQuery('#message-location-template').html();
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
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