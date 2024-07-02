import React from 'react';
import ReactDOM from 'react-dom/client';

import {TileEditor} from './components/tile-editor';

const App = () => {
   const [tileData, setTileData] = React.useState(new Array(64).fill(0));
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   return (
      <div>
      <TileEditor
         tileData={tileData}
         ontileDataChange={(data) => {setTileData(data);}}
         leftCursorColor={leftColor}
         rightCursorColor={rightColor}
      />
      <div>
      <span style={{'margin-left':'16px'}}></span>
     <button onClick={() => setLeftColor((leftColor + 1) % 4)} style={{
      width: "100px",
      height: "100px",
      backgroundColor: leftColor === 0 ? "white" : leftColor === 1 ? "lightgray" : leftColor === 2 ? "gray" : "black"
     }}>Left</button>
     <span style={{'margin-left':'16px'}}></span>
      <button onClick={() => setRightColor((rightColor + 1) % 4)} style={{
      width: "100px",
      height: "100px",
      backgroundColor: rightColor === 0 ? "white" : rightColor === 1 ? "lightgray" : rightColor === 2 ? "gray" : "black"
     }}>Right</button>
     </div></div>
   );

}

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));