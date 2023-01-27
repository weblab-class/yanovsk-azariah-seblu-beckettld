import React, { useState, useEffect, useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { SocketContext } from "../context/socket";
import axios from "axios";
import jwt_decode from "jwt-decode";

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
      if (user._id) setUserId(user._id);
    });

    return () => {};
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    axios.post(url + "/login", { token: userToken }).then((user) => {
      setUserId(user.data._id);
    });

    navigate("/lobby");
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
      <>
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout from Game
        </button>
        <p>Welcome to CodeLegend MVP. Please log in with your Google Account to play </p>
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      </>
    </GoogleOAuthProvider>
  );
}

export default Login;
