// src/components/Canvas.js
import React from "react";
import PropTypes from "prop-types";

const Canvas = ({ draw, height, width }) => {
  // CHANGED
  const canvas = React.useRef();

  React.useEffect(() => {
    const context = canvas.current.getContext("2d");
    draw(context);
  });

  return (
    <canvas
      ref={canvas}
      width={width} // CHANGED
      height={height} // CHANGED
    />
  );
};
// ADDED
Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired, // ADDED
  width: PropTypes.number.isRequired, // ADDED
};
export default Canvas;
