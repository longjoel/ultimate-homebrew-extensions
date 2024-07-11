import React from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';
import { TilesPreview } from './components/tiles-preview';


/**
 * This acquireVsCodeApi is provided by visual studio code and is used to pass messages between the extension html and the extension.
 */

const vscode = acquireVsCodeApi();


const App = ({initialData}) => {

   // merge the data comming in from the component with an empty array of data, this helps deal with those pesky out of bounds issues.
   
   let paddedInitialData = new Array(256).fill(new Array(64).fill(0));

   
   initialData.forEach((data,i) => {
      paddedInitialData[i]=data;
      
   });

   // lets get some state going.

   // the collection of ALL tiles.
   const [tileCollection, setTileCollection] = React.useState(initialData);

   // the current tile index.
   const [currentTileIndex, setCurrentTileIndex] = React.useState(0);

   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   const switchTile = (index) => {
  
      setCurrentTileIndex(index);
   };

   const updateTileData = (data) => {
     
      const newCollection = [...tileCollection];
      newCollection[currentTileIndex] = data;
      setTileCollection(newCollection);
      vscode.postMessage({ command: 'dirty_tiles', tiles: tileCollection});
   };

   const exportTiles = (start,end) => {
      vscode.postMessage({ command: 'export_tiles', tiles: tileCollection.filter((_,i) => i >= start && i <=end) });
   };

   return (
      <div >
         <div >
            <div style={{position:'absolute', width:'256px', left:'16px', top:'16px'}}>
               <TileCommands tileData={tileCollection[currentTileIndex]} setTileData={updateTileData} exportTiles={exportTiles} />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            <div style={{position:'absolute', width:'480px', left:'288px',top:'16px'}}>

               <TileEditor
                  tileData={tileCollection[currentTileIndex]}
                  ontileDataChange={updateTileData}
                  leftCursorColor={leftColor}
                  rightCursorColor={rightColor}
               />

            </div>
            <div style={{position:'absolute', width:'256px', left:'720px', top:'16px'}}>
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