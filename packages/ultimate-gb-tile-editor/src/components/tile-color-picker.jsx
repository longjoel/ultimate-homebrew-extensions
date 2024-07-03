import React from 'react';

export const TileColorPicker = ({leftColor, setLeftColor, rightColor, setRightColor}) => <div>
     
      <button onClick={() => setLeftColor((leftColor + 1) % 4)} style={{
         width: "50%",
         height: "100px",
         backgroundColor: leftColor === 0 ? "white" : leftColor === 1 ? "lightgray" : leftColor === 2 ? "gray" : "black"
      }}>Left</button>
   
      <button onClick={() => setRightColor((rightColor + 1) % 4)} style={{
         width: "50%",
         height: "100px",
         backgroundColor: rightColor === 0 ? "white" : rightColor === 1 ? "lightgray" : rightColor === 2 ? "gray" : "black"
      }}>Right</button>
   </div>;