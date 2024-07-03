import React from 'react';

export const TileColorPicker = ({leftColor, setLeftColor, rightColor, setRightColor}) => <div>
      <span style={{ 'marginLeft': '16px' }}></span>
      <button onClick={() => setLeftColor((leftColor + 1) % 4)} style={{
         width: "100px",
         height: "100px",
         backgroundColor: leftColor === 0 ? "white" : leftColor === 1 ? "lightgray" : leftColor === 2 ? "gray" : "black"
      }}>Left</button>
      <span style={{ 'marginLeft': '16px' }}></span>
      <button onClick={() => setRightColor((rightColor + 1) % 4)} style={{
         width: "100px",
         height: "100px",
         backgroundColor: rightColor === 0 ? "white" : rightColor === 1 ? "lightgray" : rightColor === 2 ? "gray" : "black"
      }}>Right</button>
   </div>;