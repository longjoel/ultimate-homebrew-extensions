
// This script will be run within the webview itself
(async () => {

    function onClickExportCFile(doc, vscode) {
        debugger;
        console.log('SEND${document.uri}');
        const msg = {
            command: 'exportCFile',
            text: JSON.stringify(doc)
        };
      
        vscode.postMessage(msg);
    }

    window.app = (doc,code) => {
        debugger;
        const appDocument = JSON.parse(doc);
        console.log('made it');
        const btn = document.createElement('button');
        btn.textContent = 'Click me';
        btn.addEventListener('click', () => onClickExportCFile(appDocument, vscode));
        
        var root = document.getElementById('app');
        
        root.appendChild(btn);
       
    };
})();