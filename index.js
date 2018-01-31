/*
  var express = require('express');
  var app = express();
*/
var express = require('express');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var http = require('http').Server(app);
var io = socketIO(http);

var userNumber = 0;

var PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res)=> {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('create user', (username) => {
    console.log('created user: ', username);
    userNumber++;
    io.emit('user joined', { userNumber, username });
  });

  socket.on('send message', (data) => {
    const { username, message } = data;
    console.log(`user: ${username} said ${message}`);
    io.emit('received message', data);
  });

  socket.on('user typing',(username) => {
    io.emit('user typing', username);
  });
  socket.on('disconnect', () => console.log('a user disconnected'));
});

http.listen(8080, () => {
  console.log(`Listening on port: ${PORT}`);
});
