function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const express = require('express')
const app = express()
const serv = require('http').Server(app);
const io = require('socket.io')(serv,{});

var SOCKET_LIST = {};
var PLAYER_DATA = {};

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/view/index.html');
});

app.use(express.static("./view"))
serv.listen(process.env.PORT);

io.sockets.on('connection', function(socket){
	var plr = {x:0,y:0,z:0,ox:0,oy:0,oz:0};
  socket.id = uuidv4();
	SOCKET_LIST[socket.id] = socket;
	PLAYER_DATA[socket.id] = plr
	//On connection adds the player and client to the lists of players and clients
	console.log("Player number " + socket.id + " has joined");

	socket.on('disconnect',function(){
    console.log("Player number " + socket.id + " has left")
		delete SOCKET_LIST[socket.id];
		delete PLAYER_DATA[socket.id];
	});

	socket.on('evnt',function(data){
		plr.x = data.x
    plr.y = data.y
    plr.z = data.z
    plr.ox = data.ox,
    plr.oy = data.oy,
    plr.oz = data.oz
	});
});
setInterval(function(){
	//^^Loops through all the players in the list and pushes their data to an array
	for(var n in SOCKET_LIST){
		var socket = SOCKET_LIST[n];
		socket.emit('newPositions',{PLAYER_DATA,n});
	}
},1000/40);
