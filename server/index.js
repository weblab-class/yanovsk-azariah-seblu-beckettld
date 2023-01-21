
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


app.get('/', (req, res) => {
    res.send('hello');
  });
  
io.on('connection', connected);

function connected(socket){
  console.log('connected:', socket.id);
  socket.emit('serverToClient', "hello client");
  socket.on('disconnect', () => {
    console.log('disconnected: ', socket.id );
  });
  
  socket.on('update', (data) => {
      console.log(data)
  })

  socket.on('clientToClient', data => {
      socket.broadcast.emit('serverToClient', data);
  });

}



// io.on('connection', (socket) => {
//     console.log('connected:', socket.id);
//     socket.emit('serverToClient', "hello client");
//     socket.on('disconnect', () => {
//       console.log('disconnected: ', socket.id );
//     });
    
//     socket.on('clientToServer', (data) => {
//         console.log(`this is ${socket.id} saying ${data}`)
//     })

//     socket.on('clientToClient', data => {
//         socket.broadcast.emit('serverToClient', data);
//     });

//   });


server.listen(9000, () => {
  console.log('listening on *:9000');
});

// const express = require('express')
// const socketIo = require("socket.io")
// const http = require('http')
// const PORT = process.env.PORT || 9000
// const app = express()
// const server = http.createServer(app)
// const io = socketIo(server,{ 
//     cors: {
//       origin: 'http://localhost:3000'
//     }
// }) //in case server and client run on different urls


// app.get('/', (req, res) => {
//     res.send("GET Request Called")
//   })

  
// io.on('connection',(socket)=>{
//   console.log('client connected: ',socket.id)
  
//   socket.join('clock-room')
  
//   socket.on('disconnect',(reason)=>{
//     console.log(reason)
//   })
// })



// setInterval(()=>{
//      io.to('clock-room').emit('time', new Date())
// },1000)
// server.listen(PORT, err=> {
//   if(err) console.log(err)
//   console.log('Server running on Port ', PORT)
// })


