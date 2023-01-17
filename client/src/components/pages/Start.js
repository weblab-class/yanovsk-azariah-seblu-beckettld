import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import { get, post } from "../../utilities";

const GOOGLE_CLIENT_ID = "935076536882-bngh1i4adlvn77n2ktm8eii4puqo02hn.apps.googleusercontent.com";
const Start = ({ userId }) => {
  const [userObj, setUserObj] = useState([]);

  useEffect(() => {
    const body = { id: userId };
    get("api/user", body).then((userObj) => {
      setUserObj(userObj);
    });
  });
  return (
    <div>
      {userObj.length > 0 ? (
        <div>
          Profile
          <br />
          Your name: {userObj[0].name} <br />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Start;
