/**

This code is produced using svgs from Ionicons
https://github.com/ionic-team/ionicons

The MIT License (MIT)

Copyright (c) 2015-present Ionic (http://ionic.io/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

import React, { Fragment } from "react";

const getPath = (name: string, color: string) => {
  switch (name) {
    case 'compass':
      return (
        <Fragment>
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
        </Fragment>
      );
    case 'chat-bubbles':
      return (
        <Fragment>
          <path
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M431 320.6c-1-3.6 1.2-8.6 3.3-12.2a33.68 33.68 0 012.1-3.1A162 162 0 00464 215c.3-92.2-77.5-167-173.7-167-83.9 0-153.9 57.1-170.3 132.9a160.7 160.7 0 00-3.7 34.2c0 92.3 74.8 169.1 171 169.1 15.3 0 35.9-4.6 47.2-7.7s22.5-7.2 25.4-8.3a26.44 26.44 0 019.3-1.7 26 26 0 0110.1 2l56.7 20.1a13.52 13.52 0 003.9 1 8 8 0 008-8 12.85 12.85 0 00-.5-2.7z"
          ></path>
          <path
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="32"
            d="M66.46 232a146.23 146.23 0 006.39 152.67c2.31 3.49 3.61 6.19 3.21 8s-11.93 61.87-11.93 61.87a8 8 0 002.71 7.68A8.17 8.17 0 0072 464a7.26 7.26 0 002.91-.6l56.21-22a15.7 15.7 0 0112 .2c18.94 7.38 39.88 12 60.83 12A159.21 159.21 0 00284 432.11"
          ></path>
        </Fragment>
      );
    default:
      return <path />;
  }
}

interface IconProps {
  size?: number;
  color?: string;
  name: 'compass'|'chat-bubbles'
}
// size is in em
function Icon({ size = 1.1, color = "#000", name }:IconProps) {
  return (
    <Fragment>
      {/* <span
        style={{ display: 'inline-block', height: '100%', verticalAlign: 'middle' }}
      /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${size}em`}
        height={`${size}em`}
        viewBox="0 0 512 512"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        {getPath(name, color)}
      </svg>
    </Fragment>
  );
}

export default Icon;
