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

  document.onkeydown = (e) => {
    if (e.key === "ArrowRight") playerRight = true;
    if (e.key === "ArrowLeft") playerLeft = true;
    if (e.key === "ArrowDown") playerDown = true;
    if (e.key === "ArrowUp") playerUp = true;
    if (e.key === "Enter" && withinRange === true) {
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "ArrowRight") playerRight = false;
    if (e.key === "ArrowLeft") playerLeft = false;
    if (e.key === "ArrowDown") playerDown = false;
    if (e.key === "ArrowUp") playerUp = false;
    if (e.key === "Enter") attemptingAccessIDE = false;
  };

  const draw = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (playerData) {
      for (const [key, value] of Object.entries(playerData)) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(value.x, value.y, value.rad, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const render = () => {
      draw(ctx, props.playerData);
      towerSpawn(ctx, canvas, towerObj);

      if (playerUp) {
        props.fromClientToServer("Up");
      } else if (playerDown) {
        props.fromClientToServer("Down");
      } else if (playerLeft) {
        props.fromClientToServer("Left");
      } else if (playerRight) {
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
