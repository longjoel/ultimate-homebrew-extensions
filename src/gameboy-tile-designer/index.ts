import * as vscode from 'vscode';


export class GameboyTileDesignerDocument implements vscode.CustomDocument {
    isDirty: boolean = false;
    uri: vscode.Uri;
    tileData: number[][] = [];
    constructor(uri: vscode.Uri, tileData: number[][]) {
        this.uri = uri;
        this.tileData = tileData;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

}

function ExportCFile(document: GameboyTileDesignerDocument): void {

    let mkRow = (row: number[]) => {
        return `{${row.map((x) => x.toString()).join(',')}}`;
    };
    let cFile = `const unsigned char tiles[256][64] = {${document.tileData.map((tile) => mkRow(tile))}};`;

    vscode.window.showSaveDialog({ filters: { 'C Files': ['c'] } })
        .then((uri) => {
            if (uri) {
                vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
            }
        });
}

export class GameBoyTileDesignerProvider implements vscode.CustomEditorProvider<GameboyTileDesignerDocument> {
    onDidChangeCustomDocument: vscode.Event<vscode.CustomDocumentEditEvent<GameboyTileDesignerDocument>> ;

    constructor(private context: vscode.ExtensionContext) {


        this.onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<GameboyTileDesignerDocument>>().event;
        
    }
    openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): GameboyTileDesignerDocument | Thenable<GameboyTileDesignerDocument> {

        let tileData: number[][] = [] as number[][];
        vscode.workspace.fs.readFile(uri).then((data) => {
            const text = new TextDecoder().decode(data);
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const parts = line.split(',');
                if (parts.length === 3) {
                    tileData.push(parts.map((x) => parseInt(x)));
                }
            }
        });
        if (tileData.length === 0) {
            tileData = new Array(256).fill(new Array(64).fill(0)) as number[][];
        }

        

        return new GameboyTileDesignerDocument(uri, tileData);
    }

    saveCustomDocument(document: GameboyTileDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        document.isDirty = false;
        const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
        vscode.workspace.fs.writeFile(document.uri, data);
        return Promise.resolve();
    }
    saveCustomDocumentAs(document: GameboyTileDesignerDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {

        document.isDirty = false;
        const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
        vscode.workspace.fs.writeFile(document.uri, data);
        return Promise.resolve();
    }
    revertCustomDocument(document: GameboyTileDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        return Promise.resolve();
    }
    backupCustomDocument(document: GameboyTileDesignerDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        return new Promise((resolve, reject) => { });
    }



    resolveCustomEditor(document: GameboyTileDesignerDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {

        webviewPanel.webview.options = { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor', 'public')] };

        webviewPanel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'export_tiles') {
                ExportCFile(JSON.parse(msg.tiles) as GameboyTileDesignerDocument);
            }
            if (msg.command === 'save_tiles') {
                document.tileData = JSON.parse(msg.tiles);
                this.saveCustomDocument(document, token);
            }

            if(msg.command === 'dirty_tiles'){
               this.onDidChangeCustomDocument((e)=>{
                e.document.isDirty = true;
               });
              
            }
        });


        const publicLocation = vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor', 'public');
        vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.html')).then((html) => {

            vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.js')).then((js) => {
                webviewPanel.webview.html = html.toString().split('<script src="index.js"></script>').join(`<script src="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(publicLocation, 'index.js'))}"></script>`);

                webviewPanel.webview.postMessage({command: 'set_tiles', tiles: document.tileData});
                //
            });
        });

    }



}