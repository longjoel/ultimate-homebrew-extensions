
// This script will be run within the webview itself
(async () => {

    function onClickExportCFile(doc, code) {
        debugger;
        console.log('SEND${document.uri}');
        const msg = {
            command: 'exportCFile',
            text: JSON.stringify(doc)
        };
      
        code.postMessage(msg);
    }

    window.app = (doc,code) => {
        debugger;
        const appDocument = JSON.parse(doc);
        console.log('made it');
        const btn = document.createElement('button');
        btn.textContent = 'Click me';
        btn.addEventListener('click', () => onClickExportCFile(appDocument, code));
        
        var root = document.getElementById('app');
        
        root.appendChild(btn);
       
    };
})();