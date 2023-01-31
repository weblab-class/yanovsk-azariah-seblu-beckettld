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
  const [rulesStatus, setRulesStatus] = useState(false);

  useEffect(() => {
    axios.get(url + "/whoami").then((user) => {
      if (user._id) {
        setUserId(user._id);
      }
    });

    return () => {};
  }, []);

  const toggleRules = () => {
    console.log("gotit");
    setRulesStatus(!rulesStatus);
  };

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
        {rulesStatus ? (
          <div className="Rules">
            <div className="nes-container is-rounded is-dark">
              <p>
                Do you have what it takes to become The Code Legend? Then go forth and prove
                yourself! Take on coding challenges far across the land, hone your programming
                skills, and fulfill your destiny!
              </p>{" "}
              <p>
                Every stage brings a new set of challenges. To become a legend, you must have an
                open ear to all requests. One cannot be a legend without demonstrating benevolence
                to all people in the land. Travel towards each character, man or beast, and aid them
                all in their personal necessities.
              </p>
              <p>
                But there cannot be more than one Code Legend! You must triumph over those who aim
                to surpass you in your endeavors! Other aspiring code legends will try to best you
                in your quest for legendary status, so complete your duties in a timely fashion!
              </p>
              <div className="closeRulesButton">
                <button onClick={toggleRules} type="button" class="nes-btn is-error">
                  <div className="rulesText">Close</div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="game_info">
          <div className="game_name">
            <h1>Code Legend</h1>
          </div>
        </div>
        <div className="form_login">
          <div className="nes-container is-rounded is-dark">
            <div className="inside_login">
              <div className="signInText">
                <p>Sign in to Play</p>
              </div>
              <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
              <div className="howtoplay_button">
                <button onClick={toggleRules} type="button" class="nes-btn is-warning">
                  <div className="rulesText">Rules</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
