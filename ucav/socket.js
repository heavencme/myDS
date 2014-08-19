var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('./public/socket.io.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
	
	socket.on('message2server', function(msg){
		console.log( msg );
    io.emit('message2client', msg);
  });
  
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

