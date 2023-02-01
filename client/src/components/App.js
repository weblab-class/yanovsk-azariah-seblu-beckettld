//==========LIBRARIES===========//
import React, { useState, useEffect, useContext } from "react";
import ErrorPage from "./pages/errorpage.jsx";
import { Routes, Route } from "react-router-dom";

//==========COMPONENTS===========//
import Login from "./pages/Login.js";
import Game from "./pages/Game.js";
import Lobby from "./pages/Lobby.js";
import ThankYou from "./pages/ThankYou";
import ChooseMap from "./pages/ChooseMap";
import { SocketContext, socket } from "./context/socket.js";

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route index element={<Login />} errorElement />
        <Route path="lobby" element={<Lobby />}>
          <Route path="choosemap" element={<ChooseMap />} />
        </Route>
        <Route path="game" element={<Game />} />
        <Route path="thankyou" element={<ThankYou />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </SocketContext.Provider>
  );
};

export default App;
