var app = require('express')();
var http = require('http').createServer(app);
var express = require('express');
var io = require('socket.io')(http);

require('dotenv').config()

const {execSync} = require('child_process');

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var connections = [

];

// var sec, min;
var seconds = 0;
var switchedOn = 0;
var counter = null;
var isPi = false;
var peopleConnectedTotal = 0;


if (process.env.isPie === 'true') {
	console.log("Is on Pi")
	execSync('gpio -g mode 2 out');
	isPi = true;
} else {
	console.log("Is on PC")
}

io.on('connection', function(socket){
	console.log(socket.id + ' connected');
	peopleConnectedTotal = peopleConnectedTotal + 1;
	connections.push({id: socket.id, pushingButton: false, timesPushed: 0})
	status();

	socket.on('disconnect', function(){

		console.log(socket.id + ' disconnected');

		var index = connections.findIndex(x => x.id === socket.id);
		// console.log("Found " + socket.id + ' At '+ index);
		connections.splice(index, 1);
		status();

	});
	
	socket.on('chat message', function(msg){
		var d = new Date();
		var day = d.getDate();
		var month = d.getMonth() + 1;
		var minutes = d.getMinutes();
		var hour = d.getHours();

		io.emit('chat message', month + '/' + day + ' ' + hour + ':' + minutes + ' ' + msg);
	});

	socket.on('click', function(state){
		var index = connections.findIndex(x => x.id === socket.id);
		// console.log( 'Updating: ' + socket.id + ' Located at: ' + index )

		connections[index].pushingButton = state;
		// connections[index].timesPushed = connections[index].timesPushed + 1;
		status();
	});

	function showLight(connections) {
		var index = connections.findIndex(x => x.pushingButton === true)
		if (index > -1) {
			return true
		} else {
			return false
		}
	}

	function incrementSeconds() {
		seconds++;
		console.log(seconds / 10);
	}

	function status() {
		if ( showLight(connections) === true ) {
			console.log("Light On");
			switchedOn++;
			counter = setInterval(incrementSeconds, 100);
			
			(isPi ? execSync('gpio -g write 2 1') : '');

		} else {
			console.log("Light Off");
			clearInterval(counter);

			(isPi ? execSync('gpio -g write 2 0') : '');
		}

		io.emit('status', connections, showLight(connections), switchedOn, seconds, peopleConnectedTotal);
	}

});

http.listen(3001, function(){
  console.log('listening on *:3001');
});