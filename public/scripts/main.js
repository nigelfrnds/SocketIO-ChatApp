$(function(){
  var socket = io();
  var connected = false;
  var username = "";

  console.log('ready');
  $('#login').show();
  $('#chat').hide();


  $('#loginForm').submit(function() {
    connected = true;
    username= $('#username').val().toUpperCase();
    $('#login').hide();
    $('#chat').show();

    socket.emit('create user', username);
    $('#username').val('');
    return false;
  });

  $('#chatForm').submit(function() {
    message = $('#m').val();
    socket.emit('send message', { username, message });
    $('#m').val('');
    return false;
  });

  $('#m').on('input', function(e) {
    socket.emit('user typing', username);
  });

  // Events to listen for
  socket.on('user joined', (data) => {
    const { userNumber, username } = data;
    $('#users').text(`${userNumber} users connected`);
    $('#messages').append($('<li>').text(`${username} joined!`));
  });

  socket.on('received message', function(data) {
    const { username, message } = data;
    console.log('message: ', message);
    $('#messages').append($('<li>').text(`${username}: ${message}`));
  });
});
