import "./App.css";
import React, { useRef, useEffect, useState } from "react";
import data from "./data";
import { towerSpawn } from "./Tower";
import { trueFunc } from "boolbase";

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
  const [towersDrawn, setTowersDrawn] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      changeCounter(counter + 1);
    }, 10);

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
      const whichTower = inTowers(props.selfPlayerPosition);
      if (whichTower !== -1) {
        props.setCurrentTower(whichTower);
      }
    }
  };

  const drawPlayers = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (playerData) {
      for (const [key, value] of Object.entries(playerData)) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(value.position.x, value.position.y, 30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  };
  function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }
  const near = (player, tower) => {
    if (getDistance(player.x, player.y, tower.x, tower.y) < 50) {
      return true;
    }
  };
  const inTowers = (position) => {
    for (const [key, value] of Object.entries(props.towerData)) {
      if (near(position, value.position)) {
        console.log(value);
        props.attemptToggleIDE(value.questionCode);
        return key;
      }
    }
    return -1;
  };
  const drawTowers = (ctx, towerData) => {
    const color = "blue";
    for (const [key, value] of Object.entries(towerData)) {
      ctx.beginPath();
      ctx.rect(value.position.x, value.position.y, 50, 50);
      ctx.fillStyle = color;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.fillStyle = color;
      ctx.shadowBlur = 0;
      ctx.shadowColor = color;
      ctx.strokeRect(value.position.x, value.position.y, 50, 50);
      ctx.fill();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    const render = () => {
      drawPlayers(ctx, props.playerData);
      drawTowers(ctx, props.towerData);
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
