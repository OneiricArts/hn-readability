import React, { Fragment } from "react";

// size is in em
function Compass({ size = 1.1, color = "#000" }) {
  return (
    <Fragment>
      <span
        style={{ display: 'inline-block', height: '100%', verticalAlign: 'middle' }}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}em`}
        height={`${size}em`}
        viewBox="0 0 512 512"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <path
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="32"
          d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        ></path>
        <path
          fill={color}
          d="M350.67 150.93l-117.2 46.88a64 64 0 00-35.66 35.66l-46.88 117.2a8 8 0 0010.4 10.4l117.2-46.88a64 64 0 0035.66-35.66l46.88-117.2a8 8 0 00-10.4-10.4zM256 280a24 24 0 1124-24 24 24 0 01-24 24z">
        </path>
      </svg>
    </Fragment>
  );
}

export default Compass;
