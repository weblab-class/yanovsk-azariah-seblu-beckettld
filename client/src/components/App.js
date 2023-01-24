import "./pages/App.css";
import React, { useState, useEffect } from "react";
import Game from "./pages/Game.js";
import io from "socket.io-client";
import Lobby from "./pages/Lobby";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import jwt_decode from "jwt-decode";

// const url = "http://localhost:3000";
const url = "https://skeletongame.herokuapp.com";
//import dotenv from "dotenv";
/**
 * Define the "App" component
 */
//const endpoint = "https://skeletongame.herokuapp.com/" + process.env.port;
const socket = io();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
//const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";

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

  const toggleIDE = () => {
    //console.log(window.location.hostname);
    // questionID: "63cec436f69993f5b4ecebb6";
    axios
      .get(url + "/problem", {
        params: {},
      })
      .then((res) => {
        setCode(res.data.problemText);
        setQuestionID(res.data.questionID);
      });
    console.log(code);
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
        //.post("https://skeletongame.herokuapp.com/submitCode/", {
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

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log(socket.id);
  //   });
  //   // return () => {
  //   //   socket.off("connect");
  //   //   socket.off("disconnect");
  //   // };
  // }, []);

  socket.on("updateFromServer", (data) => {
    setPlayerData(data);
  });

  const fromClientToServer = (childdata) => {
    socket.emit("updateFromClient", childdata);
  };

  const createNewRoom = () => {
    socket.emit("newRoom");
  };

  const joinRoom = (room_id) => {
    console.log("join room called", room_id);
    socket.emit("joinRoom", room_id);
  };

  socket.on("init", (number) => {
    console.log("HIT");
    setPlayerNumber(number);
  });

  useEffect(() => {
    if (playerNumber === 2) {
      setActive(true);
    }
  }, [playerNumber]);

  socket.on("roomId", (id) => {
    setRoomId(id);
  });

  useEffect(() => {
    axios.get(url + "/whoami").then((user) => {
      console.log(url + "/whoami");
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });

    console.log(url + "/login");
  }, []);

  const handleLogin = (credentialResponse) => {
    console.log("handle login");
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    axios.post(url + "/login", { token: userToken }).then((user) => {
      console.log(url + "/login");
      setUserId(user.data._id);
      //post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    socket.emit("disconnect");
    setUserId(undefined);
    console.log(url + "/logout");
    post(url + "/logout");
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <div>
            <p>You are {userId}</p>
            <button
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
            >
              Logout
            </button>
            {isActive ? (
              <>
                <Game
                  playerData={playerData}
                  fromClientToServer={fromClientToServer}
                  toggleIDE={toggleIDE}
                  tower={tower}
                  IDEstatus={IDEstatus}
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
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
