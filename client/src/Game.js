import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import data from "./data";
import { playerMovement } from "./Player";
import { towerSpawn } from "./Tower";
function Game(props) {
  const canvasRef = useRef(null);
  const [renderCount, setRenderCount] = useState(0);
  let { playerObj, towerObj } = data;
  let playerRight = false;
  let playerLeft = false;
  let playerUp = false;
  let playerDown = false;
  let attemptingAccessIDE = false;
  let acessingIDE = false;
  let withinRange = true;

  // document.onkeydown = (e) => {
  //   if (e.key === "ArrowRight") playerRight = true;
  //   if (e.key === "ArrowLeft") playerLeft = true;
  //   if (e.key === "ArrowDown") playerDown = true;
  //   if (e.key === "ArrowUp") playerUp = true;
  //   if (e.key === "Enter" && withinRange === true) {
  //   }
  // };
  // document.onkeyup = (e) => {
  //   if (e.key === "ArrowRight") playerRight = false;
  //   if (e.key === "ArrowLeft") playerLeft = false;
  //   if (e.key === "ArrowDown") playerDown = false;
  //   if (e.key === "ArrowUp") playerUp = false;
  //   if (e.key === "Enter") attemptingAccessIDE = false;
  // };

  const keys = {
    ArrowUp: {
      pressed: false,
    },
    ArrowDown: {
      pressed: false,
    },
    ArrowLeft: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
  };

  let lastKeyDown = "";
  document.addEventListener("keydown", function (playerWalk) {
    switch (playerWalk.key) {
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        lastKeyDown = "ArrowUp";
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = true;
        lastKeyDown = "ArrowDown";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        lastKeyDown = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        lastKeyDown = "ArrowRight";
        break;
      default:
        break;
    }
  });

  document.addEventListener("keyup", function (playerWalk) {
    switch (playerWalk.key) {
      case "ArrowUp":
        keys.ArrowUp.pressed = false;
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = false;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      default:
        break;
    }
  });
  const draw = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(playerData.x, playerData.y, playerData.rad, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const render = () => {
      draw(ctx, props.playerData);
      towerSpawn(ctx, canvas, towerObj);

      if (keys.ArrowDown.pressed && lastKeyDown === "ArrowDown") {
        props.fromClientToServer("Up");
      } else if (keys.ArrowUp.pressed && lastKeyDown === "ArrowUp") {
        props.fromClientToServer("Down");
      } else if (keys.ArrowLeft.pressed && lastKeyDown === "ArrowLeft") {
        props.fromClientToServer("Left");
      }

      if (keys.ArrowRight.pressed && lastKeyDown === "ArrowRight") {
        props.fromClientToServer("Right");
      }
      animationFrameId = window.requestAnimationFrame(render);

      // props.sendPlayerInput("Right");
      // console.log(`inside Game.js ${Object.values(props.playerData) }`)
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <div id="rootdiv">
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
}

export default Game;
