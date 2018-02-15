$(function(){
  var socket = io('http://localhost:8080?token=123');
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
    const { userList, username } = data;
    $('#users').text('');
    userList.map((username,index) => {
      $('#users').append($('<li class="user">').text(`${username}`));
    });
    $('#messages').append($('<li>').text(`${username} joined!`));
  });

  $('.user').on('click', (e) => {
    console.log('clicked on user')
  });

  socket.on('received message', function(data) {
    const { username, message, time_stamp } = data;
    console.log('message: ', message);

    var templateScript = $('#message').html();
    console.log('template: ', templateScript);
    var template = Handlebars.compile(templateScript);

    $('#messages').append(template(data));

    //$('#messages').append($('<li class="list-group-item">').text(`${username}: ${message} ${time_stamp}`));
    // $('#messages').append(
    //   `
    //   <li class="list-group-item">
    //     <span>
    //       <span>${username}: ${message}</span>
    //     </span>
    //   </li>
    //   <span class="textLeft">${time_stamp}</span>
    //   `
    // );
  });
});
