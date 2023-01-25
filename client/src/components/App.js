//==========LIBRARIES===========//
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
//==========COMPONENTS===========//
import Game from "./pages/Game.js";
import Lobby from "./pages/Lobby";

//==========LOCAL/HEROKU===========//
const url = "https://codeleg.herokuapp.com";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// const url = "http://localhost:3000";
// const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";

const socket = io();

const App = () => {
  const [playerData, setPlayerData] = useState({});
  const [playerNumber, setPlayerNumber] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [isActive, setActive] = useState(false);
  const [code, setCode] = useState("");
  const [questionID, setQuestionID] = useState(0);
  const [tower, setTower] = useState(0);
  const [IDEstatus, setIDEStatus] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const [canvasHeight, setCanvasHeight] = useState("500px");
  const [canvasWidth, setCanvasWidth] = useState("800px");

  //==========GOOGLE AUTH===========//
  useEffect(() => {
    axios.get(url + "/whoami").then((user) => {
      if (user._id) setUserId(user._id);
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    axios.post(url + "/login", { token: userToken }).then((user) => {
      setUserId(user.data._id);
    });
  };

  const handleLogout = () => {
    socket.emit("playerLeft");
    setUserId(undefined);
    post(url + "/logout");
  };

  //==========CODE SUBMISSION===========//

  const toggleIDE = () => {
    axios
      .get(url + "/problem", {
        params: {},
      })
      .then((res) => {
        setCode(res.data.problemText);
        setQuestionID(res.data.questionID);
      });
    setIDEStatus(!IDEstatus);
    const IDE = document.getElementById("overlay");
    if (IDE.className == "inactive") IDE.className = "active";
    else IDE.className = "inactive";
  };

  const onChange = (value, viewUpdate) => {
    setCode(value);
  };

  const submitCode = () => {
    console.log({ code });
    axios
      .post(url + "/submitCode", {
        code: code,
        questionID: questionID,
      })
      .then((res) => {
        if (res.data.error) {
          console.log(res.data.error);
        } else {
          console.log(res.data.testCaseResults);
          console.log(res.data.overallResult);
          if (res.data.overallResult === true) {
            console.log("You got them all right!");
            setTower(1);
          } else console.log("Too bad!");
        }
      });
  };

  //==========SOCKETS===========//
  useEffect(() => {
    if (playerNumber === 2) setActive(true);
  }, [playerNumber]);

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  const joinRoom = (room_id) => {
    socket.emit("joinRoom", room_id);
  };

  socket.on("updateFromServer", (data) => {
    setPlayerData(data);
  });

  socket.on("init", (number) => {
    setPlayerNumber(number);
  });

  socket.on("assignedRoomId", (id) => {
    setRoomId(id);
  });

  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <div>
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout from Game
            </button>
            {isActive ? (
              <>
                <Game
                  playerData={playerData}
                  fromClientToServer={fromClientToServer}
                  toggleIDE={toggleIDE}
                  tower={tower}
                  IDEstatus={IDEstatus}
                  canvasHeight={canvasHeight}
                  canvasWidth={canvasWidth}
                />
                <h1>Game Started</h1>
                <div className="inactive" id="overlay">
                  <button onClick={toggleIDE}>Close</button>
                  <CodeMirror
                    value={code}
                    height="600px"
                    theme="dark"
                    options={{ theme: "sublime" }}
                    extensions={[python()]}
                    onChange={onChange}
                  />
                  <button onClick={submitCode}>Submit</button>
                </div>
              </>
            ) : (
              <Lobby createNewRoom={createNewRoom} roomId={roomId} joinRoom={joinRoom} />
            )}
          </div>
        ) : (
          <div>
            <p>Welcome to CodeLegend MVP. Please log in with your Google Account to play </p>
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
