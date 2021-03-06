var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

console.log(name + ' wants to join ' + room );

$('.room-title').text(room);

socket.on('connect', function(){
    console.log('connected to socket.io server');

    socket.emit('joinRoom',{
        name: name,
        room: room
    });
});

socket.on('message', function(message){
    var momentTimestamp = moment.utc(message.timestamp);
    var $messages = $('.messages');
    var $message = $('<li class="list-group-item"></li>');


    if (!message.text.trim().length) {
      return;
    };

    $message.append('<p><strong>' + message.name + ' ' +momentTimestamp.local().format('h:mm:ss a') + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);
    $("html, body").animate({ scrollTop: $(document).height()});
});

// POST submit

var $form = jQuery('#message-form');

$form.on('submit', function(event){
    event.preventDefault();

    var $message = $form.find('input[name=message]');

    socket.emit('message', {
        name: name,
        text: $message.val()
    });

    $message.val(' ');

});