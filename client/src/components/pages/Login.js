import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { SocketContext } from "../context/socket";
import axios from "axios";
import jwt_decode from "jwt-decode";
import AnimatedText from "react-animated-text-content";
import { useNavigate } from "react-router-dom";

//==========LOCAL/HEROKU===========//
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const url = "https://codeleg.herokuapp.com";

const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";
const url = "http://localhost:3000";

function Login(props) {
  const [userId, setUserId] = useState("");
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(url + "/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
      }
    });

    return () => {};
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);

    axios.post(url + "/login", { token: userToken, socket_id: socket.id }).then((user) => {
      setUserId(user.data._id);
      const user_name = user.data.name;
      navigate("/lobby", { state: { user_name: user_name } });
    });
  };

  const handleLogout = () => {
    googleLogout();
    socket.emit("playerLeft");
    setUserId(undefined);
    post(url + "/logout");
    navigate("/thankyou");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="start_page">
        <div className="form_login">
          <div className="nes-container is-rounded is-dark">
            <p>Sign in to Play</p>
            <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
          </div>
        </div>

        <div className="game_info">
          <div className="nes-container is-rounded is-dark">
            <AnimatedText
              className="game_info_welcome"
              type="words" // animate words or chars
              animation={{
                x: "200px",
                y: "-20px",
                scale: 1.1,
                ease: "ease-in-out",
              }}
              animationType="float"
              interval={0.06}
              duration={0.5}
              tag="p"
              includeWhiteSpaces
              threshold={0.1}
              rootMargin="20%"
            >
              Welcome to CodeLegend, Hacker!
            </AnimatedText>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
