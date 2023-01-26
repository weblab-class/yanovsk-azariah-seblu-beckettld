import React, { useState, useEffect, useContext } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { SocketContext } from "../context/socket";

//==========LOCAL/HEROKU===========//
//const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID = "306684833672-t1s937mqipgfc70n6r022gl7rm0sh6rh.apps.googleusercontent.com";

function Login(props) {
  const socket = useContext(SocketContext);
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
        <GoogleLogin onSuccess={props.handleLogin} onError={(err) => console.log(err)} />
      </>
    </GoogleOAuthProvider>
  );
}

export default Login;
