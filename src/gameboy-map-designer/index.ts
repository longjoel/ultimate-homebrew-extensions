
import * as vscode from 'vscode';


export class GameboyMapDesignerDocument implements vscode.CustomDocument {
    uri: vscode.Uri;
   
    constructor(uri:vscode.Uri){
        this.uri = uri;
    }

    dispose(): void {

    }

}

export class GameBoyMapDesignerProvider implements vscode.CustomEditorProvider<GameboyMapDesignerDocument> {

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<GameboyMapDesignerDocument>>();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;
    private _webViewPanel?: vscode.WebviewPanel;

    constructor(private context: vscode.ExtensionContext) {

    }

    openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): GameboyMapDesignerDocument | Thenable<GameboyMapDesignerDocument> {

        var px = new Promise<GameboyMapDesignerDocument>((resolve, reject) => {

            vscode.workspace.fs.readFile(uri).then((data) => {
                let tileData: number[][] = [] as number[][];
                const text = new TextDecoder().decode(data);
                const lines = text.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const parts = line.split(',');
                    tileData.push(parts.map((x) => parseInt(x)));
                }
                if (tileData.length === 0) {
                    tileData = new Array(256).fill(new Array(64).fill(0)) as number[][];
                }

                var gbtm = new GameboyMapDesignerDocument(uri);
               // console.log("open custom document", gbtd.uniqueId, crc32(JSON.stringify(gbtd.tileData)));
                resolve(gbtm);
            });


        });

        return px;


    }

    saveCustomDocument(document: GameboyMapDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        return new Promise((resolve, reject) => {
            // console.log("Save Custom Document", document.uniqueId, crc32(JSON.stringify(document.tileData)));
            // document.isDirty = false;
            // const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
            // vscode.workspace.fs.writeFile(document.uri, data).then(() => {
            //     resolve();
            // });
        });
    }
    saveCustomDocumentAs(document: GameboyMapDesignerDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {

        return new Promise((resolve, reject) => {
            // console.log("Save Custom Document As", document.uniqueId, crc32(JSON.stringify(document.tileData)));
            // document.isDirty = false;
            // const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
            // vscode.workspace.fs.writeFile(destination, data).then(() => {
            //     resolve();
            // });
        });

    }
    revertCustomDocument(document: GameboyMapDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        return Promise.resolve();
    }
    backupCustomDocument(document: GameboyMapDesignerDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        return new Promise((resolve, reject) => { });
    }



    resolveCustomEditor(document: GameboyMapDesignerDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {

      //  console.log("Resolve Custom Editor", document.uniqueId, crc32(JSON.stringify(document.tileData)));

        webviewPanel.webview.options = {
            enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-map-editor', 'public')]
        };

        this._webViewPanel = webviewPanel;
        webviewPanel.webview.onDidReceiveMessage((msg) => {
            // if (msg.command === 'export_tiles') {
            //     var newURI = document.uri.path.replace('.gbtd', '.c');
            //     vscode.window.showSaveDialog({ saveLabel: 'Export C File', defaultUri: vscode.Uri.from({ scheme: document.uri.scheme, path: newURI }), title: 'Export C File' })
            //         .then((uri) => {
            //             if (uri) {
            //                 let cFile = convertToGBTileData(msg.tiles, uri.path.split('/').at(-1)?.split('.').at(0) ?? 'data');//= `const unsigned char ${uri.path.split('/').at(-1)?.split('.').at(0)}[${msg.tiles.length}][16] = {${msg.tiles.map((tx: number[]) => pixelsToCByteArray(tx) + "\n")}};`;
            //                 vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
            //             }
            //         });
            // }
            // if (msg.command === 'save_tiles') {
            //     document.tileData = msg.tiles;
            //     this.saveCustomDocument(document, token);
            // }
            // if (msg.command === 'dirty_tiles') {
            //     document.tileData = msg.tiles;
            //     document.isDirty = true;
            //     this.onDidChangeCustomDocument((e) => {
            //         e.document.isDirty = true;
            //         e.document.tileData = msg.tiles;
            //     });

            // }

        });



        const publicLocation = vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-map-editor', 'public');
        vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.html')).then((html) => {

            vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.js')).then((js) => {
                webviewPanel.webview.html = html.toString()
                    .split('<div id="map-data" data-map=""></div>')
                    .join(`<div id="map-data" data-map="${JSON.stringify('{}')}"></div>`)
                    .split('<script src="index.js"></script>')
                    .join(`<script src="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(publicLocation, 'index.min.js'))}"></script>`);

            });
        });

    }



}
function crc32(stringToHash: string): string {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }

    let crc = 0xFFFFFFFF;
    for (let i = 0; i < stringToHash.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ stringToHash.charCodeAt(i)) & 0xFF];
    }
    crc ^= 0xFFFFFFFF;

    return crc.toString(16).toUpperCase();
}
