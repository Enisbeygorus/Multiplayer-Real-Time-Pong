const PADDLE_COLOR = '#fff';
const BALL_COLOR = '#fff';
const BG_COLOR = '#000';
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const socket = io('http://localhost:3000');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknowGame);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const playerNameInput = document.getElementById('playerNameInput');

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let playerNumber;
let gameActive = false;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

function newGame () {
    const data = {
        playerName: playerNameInput.value
    };
    socket.emit('newGame', data);
    init();
}

function joinGame () {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
}

function init() {
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    gameActive = true;
}

function paintGame(state) {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { ball } = state;
    paintBall(ball.x, ball.y, ball.radius, BALL_COLOR);

    state.players.forEach((player) => {
        paintPlayer(player, PADDLE_COLOR);
        // paintPlayerScore(player.score, );
    });
}

function paintBall(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function paintPlayer(playerState, color) {
    ctx.fillStyle = color
    ctx.fillRect(playerState.x, playerState.y, playerState.width, playerState.height);
    ctx.fill();
}

function paintPlayerScore(score, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(score, x, y);
}

function handleInit(number){
    playerNumber = number;
}

function handleGameState(gameState){
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(date){
    if(!gameActive){
        return;
    }
    alert('You lose');
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknowGame(){
    reset();
    alert("Unknow game code");
}

function handleTooManyPlayers(){
    reset();
    alert("This game is already in progress")
}

function reset() {
    playerNumber = null;
    gameCodeInput.value = '';
    gameCodeDisplay.innerText = '';
    initialScreen.style.display = 'block';
    gameScreen.style.display = 'none';
}


const movement = {
    up: false,
    down: false,
}

setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 87: // W
        movement.up = true;
        break;
      case 83: // S
        movement.down = true;
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 87: // W
        movement.up = false;
        break;
      case 83: // S
        movement.down = false;
        break;
    }
  });