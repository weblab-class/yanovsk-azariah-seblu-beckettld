import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";

import "./SignIn.css";
import Start from "./Start";
const GOOGLE_CLIENT_ID = "935076536882-bngh1i4adlvn77n2ktm8eii4puqo02hn.apps.googleusercontent.com";
const SignIn = ({ userId, handleLogin, handleLogout }) => {
  return (
    <div>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {userId ? (
          <div>
            <Start userId={userId} />
          </div>
        ) : (
          <div className="googleLogin">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={(err) => console.log(err)}
              className="googleLogin"
            />
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignIn;
