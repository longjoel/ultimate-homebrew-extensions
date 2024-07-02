import React from 'react';
import ReactDOM from 'react-dom/client';

import {TileEditor} from './components/tile-editor';

const App = () => {
   const [tileData, setTileData] = React.useState(new Array(64).fill(0));

   return (
      <TileEditor
         tileData={tileData}
         ontileDataChange={(data) => {setTileData(data);}}
         leftCursorColor={1}
         rightCursorColor={2}
      />
   );

}

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));