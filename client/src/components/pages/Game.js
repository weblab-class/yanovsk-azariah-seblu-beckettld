import React, { useRef, useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import { python } from "@codemirror/lang-python";
import { SocketContext } from "../context/socket.js";
import Tower from "../assets/tower.png";
import { sprites } from "./data";
import "./App.css";

//==========LOCAL/HEROKU===========//
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const url = "https://codeleg.herokuapp.com";

// const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";
// const url = "http://localhost:3000";

function Game(props) {
  const { state } = useLocation();
  const map = require(`../assets/map${state.map_id}.png`);
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const canvasRef = useRef(null);
  let playerRight, playerLeft, playerUp, playerDown;
  [playerRight, playerLeft, playerUp, playerDown] = [false, false, false, false];
  const resultHeader = "____Results_____";
  const [playerData, setPlayerData] = useState({});
  const [selfPlayerPosition, setSelfPlayerPosition] = useState("");
  const [selfPlayerScore, setSelfPlayerScore] = useState(0);
  const [opponentPlayerScore, setOpponentPlayerScore] = useState(0);
  const [towerData, setTowerData] = useState({});
  const [result, setResult] = useState("");
  const [code, setCode] = useState("");
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

          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            // fromClientToServer(currentTower);
            socket.emit("updateFromClient", currentTower);
          } else console.log("Too bad!");
        }
      });
  };

  const attemptToggleIDE = (towerCode, key) => {
    if (selfTowerStatus[key] !== 1) {
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

    return () => {
      socket.off("updateFromServer");
      socket.off("newRoom");
      socket.off("startGame");
      socket.off("assignedRoomId");
      socket.off("badConnection");
    };
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
      const spriteImage = new Image();
      spriteImage.src = sprites[value.sprite_id]; //because of 0 indexing
      ctx.drawImage(spriteImage, value.position.x, value.position.y, 50, 50);
    }
  };
  function getDistance(x1, y1, x2, y2) {
    let y = x2 - x1;
    let x = y2 - y1;

    return Math.sqrt(x * x + y * y);
  }
  const near = (player, tower) => {
    if (getDistance(player.x, player.y, tower.x + 25, tower.y + 25) < 100) {
      return true;
    }
  };
  const inTowers = (position) => {
    for (const [key, value] of Object.entries(towerData)) {
      if (near(position, value.position)) {
        attemptToggleIDE(value.questionCode, key);
        return key;
      }
    }
    return -1;
  };

  const drawTowers = (ctx, towerData) => {
    const color = "blue";
    for (const [key, value] of Object.entries(towerData)) {
      ctx.beginPath();
      const towerImage = new Image();
      towerImage.src = Tower;

      if (selfTowerStatus[key] === 0) {
        ctx.drawImage(towerImage, value.position.x, value.position.y, 50, 50);
      } else {
        ctx.fillStyle = color;
        ctx.strokeRect(value.position.x, value.position.y, 50, 50);
      }
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
        <button
          onClick={() => {
            socket.emit("playerLeft");
            axios.post(url + "/logout");
            navigate("/thankyou");
          }}
        >
          Logout from Game
        </button>
        <h1>
          You {selfPlayerScore} - {opponentPlayerScore} Opponent
        </h1>

        <h1> {result}</h1>
        <div id="container">
          <canvas
            id="canvas"
            width={"1300px"}
            height={"700px"}
            ref={canvasRef}
            style={{ backgroundImage: `url('${map.default}')` }}
          />
          <div id="overlayer">
            {" "}
            {IDEstatus ? (
              <div id="flexor">
                <div id="editor-container">
                  <CodeMirror
                    value={code}
                    width={"800px"}
                    height={"500px"}
                    borderRadius={".25em"}
                    theme="dark"
                    options={{ theme: "sublime" }}
                    extensions={[python()]}
                    onChange={onChange}
                  />
                  <span>
                    <button type="button" class="nes-btn is-success" onClick={submitCode}>
                      Submit
                    </button>
                    <button type="button" class="nes-btn is-error" onClick={closeIDE}>
                      Close
                    </button>
                  </span>
                </div>
                <div id="test-results-container">
                  <h1>
                    {resultHeader} <br />
                    {IDEFeedback.map((message) =>
                      message.slice(0, 7) == "Correct" ? (
                        <div>
                          <p className="correct">
                            {message}
                            <br />
                            <br />
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="incorrect">
                            {message}
                            <br />
                            <br />
                          </p>
                        </div>
                      )
                    )}
                  </h1>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </>
    </div>
  );
}

export default Game;
