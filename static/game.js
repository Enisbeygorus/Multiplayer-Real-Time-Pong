const socket = io();
socket.on('message', function (data) {
    console.log(data);
})

const movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

document.addEventListener('keydown', function (event) {
    const keyCode = event.keyCode;
    
    switch (keyCode) {
        case 87: // W
            movement.up = true;
            break;
        case 83: // S
            movement.down = true;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    const keyCode = event.keyCode;

    switch (keyCode) {
      case 87: // W
        movement.up = false;
        break;
      case 83: // S
        movement.down = false;
        break;
    }
  });

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
const context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (let id in players) {
    const player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});