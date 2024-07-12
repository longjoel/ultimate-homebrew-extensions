import React from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';
import { TilesPreview } from './components/tiles-preview';



// This acquireVsCodeApi is provided by visual studio code and is used to pass messages between the extension html and the extension.


const vscode = acquireVsCodeApi();


const App = ({ initialData }) => {

   // merge the data comming in from the component with an empty array of data,
   // this helps deal with those pesky out of bounds issues.

   let paddedInitialData = new Array(256).fill(new Array(64).fill(0));
   initialData.forEach((data, i) => {
      paddedInitialData[i] = data;

   });


   // the collection of ALL tiles.
   const [tileCollection, setTileCollection] = React.useState(initialData);

   // the current tile index.
   const [currentTileIndex, setCurrentTileIndex] = React.useState(0);

   // the 2 different colors you can pick from.
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   // wrap the setTileCollection setter.
   const updateTileData = (data) => {

      // update the tile collection with the changed data.
      const newCollection = [...tileCollection];
      newCollection[currentTileIndex] = data;
      setTileCollection(newCollection);

      // tell vs code that the tiles are dirty.
      vscode.postMessage({ command: 'dirty_tiles', tiles: tileCollection });
   };

   // tell vscode that we have some tiles to export.
   const exportTiles = (start, end) => {
      vscode.postMessage({ command: 'export_tiles', tiles: tileCollection.filter((_, i) => i >= start && i <= end) });
   };


   // begin rendering

   return (
      <div >
         <div >

            {
               // Render the tile commands and tile color picker
               // using absolute positioning because bootstrap is overkill
               // want it to look nice in vs code on the desktop, not on a phone, not that kind of tool
            }
            <div style={{ position: 'absolute', width: '256px', left: '16px', top: '16px' }}>
               <TileCommands tileData={tileCollection[currentTileIndex]} setTileData={updateTileData} exportTiles={exportTiles} />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            {
               // Render the tile editor
            }
            <div style={{ position: 'absolute', width: '480px', left: '288px', top: '16px' }}>

               <TileEditor
                  tileData={tileCollection[currentTileIndex]}
                  ontileDataChange={updateTileData}
                  leftCursorColor={leftColor}
                  rightCursorColor={rightColor}
               />

            </div>

            {
               // Render the tile picker
            }
            <div style={{ position: 'absolute', width: '256px', left: '720px', top: '16px' }}>
               <TilesPreview
                  tileCollection={tileCollection}
                  currentTileIndex={currentTileIndex}
                  ontileChange={(index) => { setCurrentTileIndex(index); }} />

            </div>


         </div>
      </div>);

};

// Pull the initial data out of HTML
// This will be provided by the vs code extension

let data = document.querySelector('#tile-data').getAttribute('data-tiles');
if (!data) {
   data = new Array(256).fill(new Array(64).fill(0));

};

// Render the component
ReactDOM.createRoot(document.querySelector('#app')).render(<App initialData={JSON.parse(data)} />);