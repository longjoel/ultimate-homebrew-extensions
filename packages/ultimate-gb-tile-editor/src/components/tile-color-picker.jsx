import React from 'react';

export const TileColorPicker = ({leftColor, setLeftColor, rightColor, setRightColor}) => <div>
     
      <button onClick={() => setLeftColor((leftColor + 1) % 4)} style={{
         width: "50%",
         height: "100px",
         backgroundColor: leftColor === 0 ? "black" : leftColor === 1 ? "white" : leftColor === 2 ? "lightgray" : "gray"
      }}>Left</button>
   
      <button onClick={() => setRightColor((rightColor + 1) % 4)} style={{
         width: "50%",
         height: "100px",
         backgroundColor: rightColor === 0 ? "black" : rightColor === 1 ? "white" : rightColor === 2 ? "lightgray" : "gray"
      }}>Right</button>
   </div>;