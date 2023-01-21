import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Canvas from './components/Canvas';


const socket = io('http://localhost:9000')

const draw = context => {

  // Insert your canvas API code to draw an image
};


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [coordinates, setCoordinates] = useState('');


  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });


    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };

  }, []);

  //need function to get players coordianted from canvas and emit to server
  const childToParent = (childdata) => {
    socket.emit("update", childdata);
  }





  const socketSend=()=>{}
  // useEffect(() => {
  //   var canvas = document.getElementById("canvas");
  //   var ctx = canvas.getContext("2d");

  //   //putWallsAround(0,0,canvas.clientWidth, canvas.clientHeight);
  //   let startX = 40+Math.random()*560;
  //   let startY= 40+Math.random()*400;
  //   context.drawImage(img, 10, 30);

  //   let playerBall = new Ball(startX, startY, 40,5);
  //   playerBall.player = true;
  //   playerBall.maxSpeed = 5;

  // }, []);

  return (
    <div>
      <p>Connected: { '' + isConnected }</p>
      <Canvas draw={draw} height={500} width={750} childToParent={childToParent} />
    </div>
  );
}

export default App;