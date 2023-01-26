import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import data from "./data";

function Game(props) {
  const canvasRef = useRef(null);
  let { towerObj } = data;
  let playerRight, playerLeft, playerUp, playerDown;
  [playerRight, playerLeft, playerUp, playerDown] = [false, false, false, false];

  document.onkeydown = (e) => {
    if (!props.IDEstatus) {
      if (e.key === "ArrowRight") playerRight = true;
      if (e.key === "ArrowLeft") playerLeft = true;
      if (e.key === "ArrowDown") playerDown = true;
      if (e.key === "ArrowUp") playerUp = true;
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "ArrowRight") playerRight = false;
    if (e.key === "ArrowLeft") playerLeft = false;
    if (e.key === "ArrowDown") playerDown = false;
    if (e.key === "ArrowUp") playerUp = false;
    if (!props.IDEstatus && e.key === "Enter") {
      props.toggleIDE();
    }
  };

  const draw = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const [key, value] of Object.entries(playerData)) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(value.position.x, value.position.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const render = () => {
      draw(ctx, props.playerData);
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
  }, [draw]);

  return (
    <div id="rootdiv">
      <canvas id="canvas" width={800} height={500} ref={canvasRef} />
    </div>
  );
}

export default Game;
