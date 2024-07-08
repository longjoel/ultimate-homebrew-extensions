import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';
import { TilesPreview } from './components/tiles-preview';

if (!acquireVsCodeApi) {
   var acquireVsCodeApi = function () {
      return {
         postMessage: function (message) { }
      };
   };
}

const vscode = acquireVsCodeApi();


const App = () => {

   const [tileCollection, setTileCollection] = React.useState([...new Array(256).fill(new Array(64).fill(0).map(() => 0))]);

   const [currentTileIndex, setCurrentTileIndex] = React.useState(0);

   const [tileData, setTileData] = React.useState(new Array(64).fill(0).map(() => 0));
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   const [isDirty, setIsDirty] = React.useState(false);

   const switchTile = (index) => {
      // update list with current title
      let newTileCollection = [...tileCollection];
      let localTileData = tileData;
      if (!localTileData || !localTileData.length) { localTileData = new Array(64).fill(0).map(() => 0); }
      newTileCollection[currentTileIndex] = localTileData;
      setTileCollection(newTileCollection);
      // update current tile index
      setCurrentTileIndex(index);
      setTileData(tileCollection[index]);

   };

   const updateTileData = (data) => {
      setTileData(data);
      const newCollection = [...tileCollection];
      newCollection[currentTileIndex] = data;
      setTileCollection(newCollection);
      setIsDirty(true);
      vscode.postMessage({ command: 'dirty_tiles', tiles: tileCollection});
   };

   const exportTiles = () => {
      vscode.postMessage({ command: 'export_tiles', tiles: tileCollection });
   };

   useEffect(() => {

      const eventListener = (event)=>{
         const message = event.data; // The JSON data our extension sent
         switch (message.command) {
            case 'set_tiles':
               setTileCollection(message.tiles);
               setTileData(message.tiles[0]);
               setCurrentTileIndex(0);
               console.log('setting tiles', message.tiles[0]);
               break;
         }
      };

      console.log('adding event listener');
      window.addEventListener('message', eventListener);
      return () => {
         console.log('removing event listener.');
         window.removeEventListener('message',eventListener);

      };
},[]);

   return (
      <div className='fluid-container'>
         <div className='row' >
            <div className='col-2' >
               <TileCommands tileData={tileData} setTileData={updateTileData} exportTiles={exportTiles} />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            <div className='col-5' >

               <TileEditor
                  tileData={tileData}
                  ontileDataChange={updateTileData}
                  leftCursorColor={leftColor}
                  rightCursorColor={rightColor}
               />

            </div>
            <div className='col-2' >
               <TilesPreview
                  tileCollection={tileCollection}
                  currentTileIndex={currentTileIndex}
                  ontileChange={(index) => { switchTile(index); }} />

            </div>


         </div>
      </div>);

};

ReactDOM.createRoot(document.querySelector('#app')).render(<App initialData={[]}/>);