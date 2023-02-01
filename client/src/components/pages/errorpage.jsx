import "./App.css";
import React from "react";

export default function ErrorPage() {
  return (
    <div className="thank_you_wrapper">
      <div className="nes-container is-rounded is-dark">
        <br />
        <div className="thank-you-buttons">
          <p>Sorry, This Page Doesn't Exist</p>

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
}
