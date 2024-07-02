import React from 'react';
import ReactDOM from 'react-dom/client';

import {Tile} from './components/tile';

const App = () => {
   const [tileData, setTileData] = React.useState(new Array(64).fill(0));

   return (
      <Tile
         tileData={tileData}
         ontileDataChange={(data) => {setTileData(data);}}
         leftCursorColor={1}
         rightCursorColor={0}
      />
   );

}

ReactDOM.createRoot(document.querySelector('#app')).render(
   React.createElement(App));