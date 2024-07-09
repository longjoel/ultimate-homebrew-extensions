import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';
import { TilesPreview } from './components/tiles-preview';


const vscode = acquireVsCodeApi();


const App = ({initialData}) => {

   const [tileCollection, setTileCollection] = React.useState([...initialData]);

   const [currentTileIndex, setCurrentTileIndex] = React.useState(0);

   const [tileData, setTileData] = React.useState(initialData[0]);
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   const switchTile = (index) => {
      // update list with current title
      let newTileCollection = [...tileCollection];
      newTileCollection[currentTileIndex] = tileData;
      setTileCollection(newTileCollection);
      // update current tile index
      setCurrentTileIndex(index);
      setTileData(newTileCollection[index]);
   };

   const updateTileData = (data) => {
      setTileData(data);
      const newCollection = [...tileCollection];
      newCollection[currentTileIndex] = data;
      setTileCollection(newCollection);
      vscode.postMessage({ command: 'dirty_tiles', tiles: tileCollection});
   };

   const exportTiles = () => {
      vscode.postMessage({ command: 'export_tiles', tiles: tileCollection });
   };

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
let data = document.querySelector('#tile-data').getAttribute('data-tiles');
if(!data){
   data = new Array(256).fill(new Array(64).fill(0));

};
ReactDOM.createRoot(document.querySelector('#app')).render(<App initialData={JSON.parse(data)}/>);