import "./App.css";
import React, { useRef, useEffect, useState} from "react";
import data from "./data";
import { playerMovement } from "./Player";
import { towerSpawn } from "./Tower";

const Canvas = props => {

  const keys = {
      ArrowUp: {
        pressed:false
      },
      ArrowDown: {
        pressed:false
      },
      ArrowLeft: {
        pressed:false
      },
      ArrowRight: {
        pressed:false
      }
  }
  
  let lastKeyDown = '';
  document.addEventListener('keydown', function(playerWalk) {
    switch (playerWalk.key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = true
        lastKeyDown = 'ArrowUp'
      break;
      case 'ArrowDown':
        keys.ArrowDown.pressed = true
        lastKeyDown = 'ArrowDown'
      break;
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          lastKeyDown = 'ArrowLeft'
        break;
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          lastKeyDown = 'ArrowRight'
        break;
        default:
        break;
      }
  });
    
  document.addEventListener('keyup', function(playerWalk) {
    switch (playerWalk.key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = false
      break;
      case 'ArrowDown':
        keys.ArrowDown.pressed = false
      break;
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = false
        break;
        case 'ArrowRight':
          keys.ArrowRight.pressed = false
        break;
        default:
        break;
    }
  });


  const canvasRef = useRef(null)

  const draw = (ctx, playerData) => {




    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()

    //ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.arc(playerData.x, playerData.y, playerData.rad, 0, 2 * Math.PI);
    ctx.arc(100, 110, 5, 0, 2 * Math.PI);

    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

  }
  
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    let animationFrameId

    const render = () => {
        animationFrameId = window.requestAnimationFrame(render)
        draw(context, props.playerData)


      if (keys.ArrowDown.pressed && lastKeyDown === 'ArrowDown')  {
        props.fromClientToServer("Up");
      } 
      else if (keys.ArrowUp.pressed && lastKeyDown === 'ArrowUp') {
        props.fromClientToServer("Down");
      } 
      
      else if (keys.ArrowLeft.pressed && lastKeyDown === 'ArrowLeft') {
        props.fromClientToServer("Left");
      } 

      if (keys.ArrowRight.pressed && lastKeyDown === 'ArrowRight') {
        props.fromClientToServer("Right");
      } 


      }
      render()


      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }


    draw(context)
  }, [draw])
  
  return <canvas ref={canvasRef}/>
}

export default Canvas