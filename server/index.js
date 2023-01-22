
const express = require('express');
const app = express();
const http = require('http');
const { connect } = require('http2');
const server = http.createServer(app);
const socketIo = require("socket.io");


const io = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
}) //in case server and client run on different urls

let players = {};


app.get('/', (req, res) => {
    res.send('hello');
  });
  
io.on('connection', connected);

function connected(socket){


  socket.on('disconnect', () => {
    delete players[socket.id]
    console.log(`Current players ${Object.keys(players)}`)
    io.emit('updateFromServer', players);
  });
  
  socket.on('updateFromClient', (data) => {
    console.log(data)
    if (data === "Up" && (players[socket.id])){
      players[socket.id].y -= 1  
    }

    if (data === "Down" && (players[socket.id])){
      players[socket.id].y += 1  
    }

    if (data === "Right" && (players[socket.id])){
      players[socket.id].x += 1  

    }
    if (data === "Left" && (players[socket.id])){
      players[socket.id].x -= 1  
    }

    console.log(players[socket.id]);
    io.emit('updateFromServer', players)
  })

  socket.on('newPlayer', data => { 
    
    players[socket.id] = data

    console.log(`Starting position ${data.x}, ${data.y} player ${socket.id}, rad: ${data.rad}`)
    console.log(`Current number of players ${Object.keys(players).length}`)
    console.log(`Current players ${Object.keys(players)}`)
    
    io.emit('updateFromServer', players);
  })


}

server.listen(9000, () => {
  console.log('listening on *:9000');
});

