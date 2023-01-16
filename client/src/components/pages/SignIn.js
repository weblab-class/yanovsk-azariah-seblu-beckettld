import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import { get, post } from "../../utilities";

import "./SignIn.css";
const GOOGLE_CLIENT_ID = "935076536882-bngh1i4adlvn77n2ktm8eii4puqo02hn.apps.googleusercontent.com";
const SignIn = ({ userId, handleLogin, handleLogout }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    get("/api/allUsers").then((userObjs) => {
      setUsers(userObjs);
    });
  });
  let usersList = null;
  const hasUsers = users.length != 0;
  if (hasUsers) {
    usersList = users.map((usersObjs) => usersObjs.googleid);
  }
  return (
    <div className="centerline">
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <button
            onClick={() => {
              googleLogout();
              handleLogout();
            }}
          >
            Logout
          </button>
        ) : (
          <div className="googleLogin">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={(err) => console.log(err)}
              className="googleLogin"
            />
          </div>
        )}
        <h1>Good luck on your project :)</h1>
        <h2> What you need to change in this skeleton</h2>
        <ul>
          <li>
            Change the Frontend CLIENT_ID (Skeleton.js) to your team's CLIENT_ID (obtain this at
            http://weblab.us/clientid)
          </li>
          <li>Change the Server CLIENT_ID to the same CLIENT_ID (auth.js)</li>
          <li>
            Change the Database SRV (mongoConnectionURL) for Atlas (server.js). You got this in the
            MongoDB setup.
          </li>
          <li>Change the Database Name for MongoDB to whatever you put in the SRV (server.js)</li>
        </ul>
        <h2>How to go from this skeleton to our actual app</h2>
        <a href="https://docs.google.com/document/d/110JdHAn3Wnp3_AyQLkqH2W8h5oby7OVsYIeHYSiUzRs/edit?usp=sharing">
          Check out this getting started guide
        </a>
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignIn;
