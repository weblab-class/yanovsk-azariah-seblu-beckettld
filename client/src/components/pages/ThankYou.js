import "./App.css";
import React from "react";
import { useLocation } from "react-router-dom";
import AnimatedText from "react-animated-text-content";
import YouLose from "../assets/youlose.png";

const ThankYou = () => {
  const { state } = useLocation();

  return (
    <div className="thank_you_wrapper">
      <div className="nes-container is-rounded is-dark">
        <AnimatedText
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
          Thank you for playing CodeLegend!
        </AnimatedText>

        <div className="game-outcome">
          {state.result === "You Win" ? (
            <div>
              <br />
              <i class="nes-icon trophy is-large"></i>
              <br /> <br />
              <span class="nes-text is-success">You win! Great Job!</span>
            </div>
          ) : (
            <div className="you-lose">
              <img src={YouLose} style={{ width: "130px" }} />
              <br />
              <span class="nes-text is-error">Sorry, but you lose</span>
            </div>
          )}
        </div>
        <br />
        <div className="thank-you-buttons">
          <a href="https://codeleg.herokuapp.com/lobby">
            <button type="button" className="nes-btn">
              Play Again
            </button>
          </a>
          <a href="https://codeleg.herokuapp.com/">
            <button type="button" class="nes-btn is-primary">
              Main Page
            </button>
          </a>
        </div>
        <br />
        <p style={{ fontSize: "10px", textAlign: "center", color: "gray" }}>
          Simply close this page to log out & leave
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
