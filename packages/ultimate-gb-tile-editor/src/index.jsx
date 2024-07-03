import React from 'react';
import ReactDOM from 'react-dom/client';

import { TileEditor } from './components/tile-editor';
import { TileColorPicker } from './components/tile-color-picker';
import { TileCommands } from './components/tile-commands';
import { TilesPreview } from './components/tiles-preview';

const App = () => {

   const [tileCollection, setTileCollection] = React.useState([new Array(256).fill(new Array(64).fill(0))]);

   const [currentTileIndex, setCurrentTileIndex] = React.useState(0);

   const [tileData, setTileData] = React.useState(tileCollection[currentTileIndex]);
   const [leftColor, setLeftColor] = React.useState(1);
   const [rightColor, setRightColor] = React.useState(0);

   const switchTile = (index) => {
      // update list with current title
      let newTileCollection = [...tileCollection];
      newTileCollection[currentTileIndex] = tileData;
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
   };

   return (
      <div className='fluid-container'>
         <div className='row' >
            <div className='col-2' >
               <TileCommands tileData={tileData} setTileData={updateTileData} />
               <TileColorPicker leftColor={leftColor} rightColor={rightColor} setLeftColor={setLeftColor} setRightColor={setRightColor} />

            </div>
            <div className='col-4' >

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

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));