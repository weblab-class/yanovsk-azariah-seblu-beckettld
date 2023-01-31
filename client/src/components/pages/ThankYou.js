import React from "react";
import { useLocation } from "react-router-dom";

const ThankYou = () => {
  const { state } = useLocation();

  return <div>{state.result}</div>;
};

export default ThankYou;
