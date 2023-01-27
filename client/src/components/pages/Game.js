import "./App.css";
import React, { useRef, useEffect, useState, useContext } from "react";
import data from "./data";
import { trueFunc } from "boolbase";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { python } from "@codemirror/lang-python";
import { SocketContext } from "../context/socket.js";

//==========LOCAL/HEROKU===========//
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const url = "https://codeleg.herokuapp.com";

const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";
const url = "http://localhost:3000";

function Game(props) {
  const socket = useContext(SocketContext);
  const [playerData, setPlayerData] = useState({});

  const canvasRef = useRef(null);
  let { towerObj } = data;
  let playerRight, playerLeft, playerUp, playerDown;
  [playerRight, playerLeft, playerUp, playerDown] = [false, false, false, false];

  const [selfPlayerPosition, setSelfPlayerPosition] = useState("");
  const [selfPlayerScore, setSelfPlayerScore] = useState(0);
  const [opponentPlayerScore, setOpponentPlayerScore] = useState(0);
  const [towerData, setTowerData] = useState({});
  const [result, setResult] = useState("");
  const [code, setCode] = useState("");
  const [questionID, setQuestionID] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);
  const [currentTower, setCurrentTower] = useState(0);
  const [selfTowerStatus, setSelfTowerStatus] = useState([]);
  const [IDEFeedback, setIDEFeedback] = useState([]);

  const endgame = (result) => {
    setResult(result);
  };

  const closeIDE = () => {
    towerData[currentTower].questionCode = code;
    setIDEStatus(false);
    setIDEFeedback([]);
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const submitCode = () => {
    axios
      .post(url + "/submitCode", {
        code: code,
        questionID: towerData[currentTower].questionID,
      })
      .then((res) => {
        if (res.data.error) {
          setIDEFeedback([res.data.error]);
        } else {
          const finalArr = [];
          for (const obj of res.data.testCaseResultsWithMessages) {
            let IDEmessage = "";
            IDEmessage +=
              (Object.keys(obj)[0] === "True" ? "Correct: " : "Incorrect: ") +
              Object.values(obj)[0] +
              "\n";
            finalArr.push(IDEmessage);
          }
          setIDEFeedback(finalArr);

          // let IDEmessage="";
          // for (const obj of res.data.testCaseResultsWithMessages) {
          //   IDEmessage +=
          //     (Object.keys(obj)[0] === "True" ? "Correct: " : "Incorrect: ") +
          //     Object.values(obj)[0] +
          //     "\n";

          // }
          // setIDEFeedback(IDEmessage);

          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            // fromClientToServer(currentTower);
            socket.emit("updateFromClient", currentTower);
          } else console.log("Too bad!");
        }
      });
  };

  const attemptToggleIDE = (towerCode) => {
    if (selfTowerStatus[currentTower] !== 1) {
      setCode(towerCode);
      setIDEStatus(true);
    }
  };

  useEffect(() => {
    socket.on("updateFromServer", (data) => {
      for (const [key, value] of Object.entries(data)) {
        if (key === socket.id) {
          setSelfPlayerPosition(value.position);
          setSelfPlayerScore(value.score);
          setSelfTowerStatus(value.tower_status);
          if (value.score === value.tower_status.length) {
            endgame("You Win");
          }
        } else {
          setOpponentPlayerScore(value.score);
          if (value.score === value.tower_status.length) {
            endgame("You Lose");
          }
        }
      }
      setPlayerData(data);
    });

    socket.on("initTowers", (data) => {
      setTowerData(data);
    });
  }, []);

  document.onkeydown = (e) => {
    if (!IDEstatus) {
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

    if (!IDEstatus && e.key === "Enter") {
      const whichTower = inTowers(selfPlayerPosition);
      if (whichTower !== -1) {
        setCurrentTower(whichTower);
      }
    }
  };

  const drawPlayers = (ctx, playerData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const [key, value] of Object.entries(playerData)) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(value.position.x, value.position.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };
  function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }
  const near = (player, tower) => {
    if (getDistance(player.x, player.y, tower.x + 25, tower.y + 25) < 55) {
      return true;
    }
  };
  const inTowers = (position) => {
    for (const [key, value] of Object.entries(towerData)) {
      if (near(position, value.position)) {
        console.log(position, value.position);
        attemptToggleIDE(value.questionCode);
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
      drawPlayers(ctx, playerData);
      drawTowers(ctx, towerData);
      if (playerUp) {
        socket.emit("updateFromClient", "Up");
      } else if (playerDown) {
        socket.emit("updateFromClient", "Down");
      } else if (playerLeft) {
        socket.emit("updateFromClient", "Left");
      } else if (playerRight) {
        socket.emit("updateFromClient", "Right");
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [playerData, IDEstatus]);

  return (
    <div>
      <>
        <canvas id="canvas" width={"800px"} height={"500px"} ref={canvasRef} />
        <button
          onClick={() => {
            socket.emit("playerLeft");
            //axios.post(url + "/logout");
            axios.post("http://localhost:3000/logout");
            navigate("/thankyou");
          }}
        >
          Logout from Game (Doesnt work)
        </button>
        <h1>
          You {selfPlayerScore} - {opponentPlayerScore} Opponent
        </h1>

        <h1> {result}</h1>
      </>

      {IDEstatus ? (
        <>
          <button onClick={closeIDE}>Close</button>
          <CodeMirror
            value={code}
            height="600px"
            theme="dark"
            options={{ theme: "sublime" }}
            extensions={[python()]}
            onChange={onChange}
          />
          <button onClick={submitCode}>Submit</button>
          <h1>
            {IDEFeedback.map((message) => (
              <li>{message}</li>
            ))}
          </h1>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Game;
