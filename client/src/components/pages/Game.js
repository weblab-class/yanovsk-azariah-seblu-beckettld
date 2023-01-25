import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import data from "./data";
import { towerSpawn } from "./Tower";

function Game(props) {
  const canvasRef = useRef(null);
  let { towerObj } = data;
  // let playerRight, playerLeft, playerUp, playerDown;
  // [playerRight, playerLeft, playerUp, playerDown] = [false, false, false, false];
  const [playerRight, setPlayerRight] = useState(false);
  const [playerLeft, setPlayerLeft] = useState(false);
  const [playerDown, setPlayerDown] = useState(false);
  const [playerUp, setPlayerUp] = useState(false);
  const [counter, changeCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      changeCounter(counter + 1);
    }, 1);

    return () => clearInterval(interval);
  }, [counter]);
  document.onkeydown = (e) => {
    if (!props.IDEstatus) {
      if (e.key === "ArrowRight") setPlayerRight(true);
      if (e.key === "ArrowLeft") setPlayerLeft(true);
      if (e.key === "ArrowDown") setPlayerDown(true);
      if (e.key === "ArrowUp") setPlayerUp(true);
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "ArrowRight") setPlayerRight(false);
    if (e.key === "ArrowLeft") setPlayerLeft(false);
    if (e.key === "ArrowDown") setPlayerDown(false);
    if (e.key === "ArrowUp") setPlayerUp(false);
    if (!props.IDEstatus && e.key === "Enter") {
      props.toggleIDE();
    }
  };

  const draw = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (playerData) {
      console.log(playerData);
      for (const [key, value] of Object.entries(playerData)) {
        console.log(key, value);

        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(value.position.x, value.position.y, 30, 0, 2 * Math.PI);
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
      towerSpawn(ctx, canvas, towerObj, props.tower);
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
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [counter]);

  return (
    <div id="rootdiv">
      <canvas id="canvas" width={props.canvasWidth} height={props.canvasHeight} ref={canvasRef} />
    </div>
  );
}

export default Game;
