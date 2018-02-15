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

var userList = [];

var PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req,res)=> {
  res.sendFile('index.html');
});

io.use((socket,next) => {
  let { token } = socket.handshake.query;
  if(token === '123') {
    console.log('client authenticated!');
    next();
  } else {
    return next(new Error('authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('create user', (username) => {
    console.log('created user: ', username);
    userList.push(username);
    io.emit('user joined', { userList, username });
  });

  socket.on('send message', (data) => {
    const { username, message } = data;

    const TIME_STAMP = new Date().toLocaleTimeString('en-CA', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    console.log(`user: ${username} said ${message} at ${TIME_STAMP}`);
    io.emit('received message', { ...data, time_stamp: TIME_STAMP });
  });

  socket.on('user typing',(username) => {
    io.emit('user typing', username);
  });
  socket.on('disconnect', () => console.log('a user disconnected'));
});

http.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
