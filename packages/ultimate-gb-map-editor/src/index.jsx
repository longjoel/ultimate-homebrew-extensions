import React from 'react';
import ReactDOM from 'react-dom/client';



// This acquireVsCodeApi is provided by visual studio code and is used to pass messages between the extension html and the extension.


const vscode = acquireVsCodeApi();


const App = ({ initialData }) => {

   // begin rendering

   return (
      <div >
     Hello World.
      </div>);

};

// Pull the initial data out of HTML
// This will be provided by the vs code extension

let data = document.querySelector('#map-data').getAttribute('data-map');
if (!data) {
   data = new Array(256).fill(0);

 };

// Render the component
ReactDOM.createRoot(document.querySelector('#app')).render(<App  />);