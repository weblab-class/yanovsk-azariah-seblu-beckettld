
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
  console.log('connected:', socket.id);

  socket.emit('serverToClient', "hello client");

  socket.on('disconnect', () => {
    delete players[socket.id]
    console.log(`Current players ${Object.keys(players)}`)
    io.emit('updatePlayers', players);
  });
  
  // socket.on('update', (data) => {
  //     console.log(data)
  // })
  socket.on('newPlayer', data => { 
    players[socket.id] = data
    console.log(`Starting position ${data.x}, ${data.y} player ${socket.id}`)
    console.log(`Current number of players ${Object.keys(players).length}`)
    console.log(`Current players ${Object.keys(players)}`)
    
    io.emit('updatePlayers', players);
  })

  socket.on('clientToClient', data => {
      socket.broadcast.emit('serverToClient', data);
  });

}

server.listen(9000, () => {
  console.log('listening on *:9000');
});

