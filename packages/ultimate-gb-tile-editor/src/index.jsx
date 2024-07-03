import React from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';

const TileCommander = ({ tileData, setTileData }) => {

   const clearTiles = () => {
      setTileData(new Array(64).fill(0));
   };

   const rollTilesUp = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 8; x++) {
            newTileData[y * 8 + x] = tileData[(y % 7 + 1) * 8 + x];
         }
      }
      setTileData(newTileData);
   };




   const rollTilesDown = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 8; x++) {
            let srcY = y - 1;
            if (srcY < 0) { srcY = 7; }
            newTileData[y * 8 + x] = tileData[srcY * 8 + x];
         }
      }
      setTileData(newTileData);
   };

   const rollTilesLeft = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 8; x++) {
            newTileData[y * 8 + x] = tileData[y * 8 + (x + 1) % 8];
         }
      }
      setTileData(newTileData);
   };

   const flipTilesHorizontal = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 4; x++) {
            let srcX = 7 - x;
            newTileData[y * 8 + x] = tileData[y * 8 + srcX];
            newTileData[y * 8 + srcX] = tileData[y * 8 + x];
         }
      }
      setTileData(newTileData);
   };

   const rollTilesRight = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 8; x++) {
            let srcX = x - 1;
            if (srcX < 0) { srcX = 7; }
            newTileData[y * 8 + x] = tileData[y * 8 + srcX];
         }
      }
      setTileData(newTileData);
   };

   const flipTilesVertical = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 4; y++) {
         for (let x = 0; x < 8; x++) {
            let srcY = 7 - y;
            newTileData[y * 8 + x] = tileData[srcY * 8 + x];
            newTileData[srcY * 8 + x] = tileData[y * 8 + x];
         }
      }
      setTileData(newTileData);
   };

   const rotateCW = () => {
      let newTileData = [...tileData];
      for (let y = 0; y < 8; y++) {
         for (let x = 0; x < 8; x++) {
            newTileData[y * 8 + x] = tileData[(7 - x) * 8 + y];
         }
      }
      setTileData(newTileData);
   };

   return <div> <button style={{ width: 125 }} onClick={clearTiles}>Clear</button>
      <button style={{ width: 125 }} onClick={rollTilesUp}>Roll up</button>
      <button style={{ width: 125 }} onClick={rollTilesDown}>Roll down</button>
      <button style={{ width: 125 }} onClick={rollTilesLeft}>Roll left</button>
      <button style={{ width: 125 }} onClick={rollTilesRight}>Roll right</button>
      <button style={{ width: 125 }} onClick={flipTilesHorizontal}>Flip Horizontal</button>
      <button style={{ width: 125 }} onClick={flipTilesVertical}>Flip Vertical</button>
      <button style={{ width: 125 }} onClick={rotateCW}>Rotate CW</button></div>;
};


const App = () => {
   const [tileData, setTileData] = React.useState(new Array(64).fill(0));
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   return (
      <div className='fluid-container'>
         <div className='row' >
            <div className='col-2' >
               <TileCommander tileData={tileData} setTileData={setTileData} />
            </div>
            <div className='col-8' >

               <TileEditor
                  tileData={tileData}
                  ontileDataChange={(data) => { setTileData(data); }}
                  leftCursorColor={leftColor}
                  rightCursorColor={rightColor}
               />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            <div className='col-2' ></div>


         </div>
      </div>
   );

};

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));