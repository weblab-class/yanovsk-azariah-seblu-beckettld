import React, { useRef, useEffect } from "react";
import data from "./data";
import { playerMovement } from "./Player";
import { towerSpawn } from "./Tower";
function Game(props) {
  const canvasRef = useRef(null);

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
      props.toggleIDE();
    }
  };
  document.onkeyup = (e) => {
    if (e.key === "ArrowRight") playerRight = false;
    if (e.key === "ArrowLeft") playerLeft = false;
    if (e.key === "ArrowDown") playerDown = false;
    if (e.key === "ArrowUp") playerUp = false;
    if (e.key === "Enter") attemptingAccessIDE = false;
  };
  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      towerSpawn(ctx, canvas, towerObj);
      // playerMovement(
      //   ctx,
      //   canvas,
      //   playerObj,
      //   playerRight,
      //   playerLeft,
      //   playerUp,
      //   playerDown
      // );
      props.sendInput("Up");
      console.log(`inside Game.js ${Object.values(props.playerData) }`)
      playerObj = props.playerData
      requestAnimationFrame(render);
    };


    render();
  }, []);
  return (
    <div id="rootdiv">
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
}

export default Game;
