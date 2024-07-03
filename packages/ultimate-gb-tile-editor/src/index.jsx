import React from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';

const App = () => {
   const [tileData, setTileData] = React.useState(new Array(64).fill(0));
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   return (
      <div className='fluid-container'>
         <div className='row' >
            <div className='col-2' >
               <TileCommands tileData={tileData} setTileData={setTileData} />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            <div className='col-8' >

               <TileEditor
                  tileData={tileData}
                  ontileDataChange={(data) => { setTileData(data); }}
                  leftCursorColor={leftColor}
                  rightCursorColor={rightColor}
               />

            </div>
            <div className='col-2' ></div>


         </div>
      </div>
   );

};

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));