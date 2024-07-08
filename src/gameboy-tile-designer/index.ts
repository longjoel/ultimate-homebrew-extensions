
import * as vscode from 'vscode';

function binToHex(s: string) {
    const byteMap: Record<string, string> = {
        "0000": "0",
        "0001": "1",
        "0010": "2",
        "0011": "3",
        "0100": "4",
        "0101": "5",
        "0110": "6",
        "0111": "7",
        "1000": "8",
        "1001": "9",
        "1010": "A",
        "1011": "B",
        "1100": "C",
        "1101": "D",
        "1110": "E",
        "1111": "F"
    };

    let parts = [];
    for (let i = 0; i < s.length; i += 8) {
        let subStrA = byteMap[s.slice(i, i + 4)];
        let subStrB = byteMap[s.slice(i + 4, i + 8)];
        parts.push(`0x${subStrA}${subStrB}`);
    }

    return parts.join(", ");
}

const pixelsToCByteArray = (data: number[]) => {
    const bitMap: Record<number, string> = { 0: "00", 1: "01", 2: "10", 3: "11" };
    let arr = data.map((d) => bitMap[d]);
    let outStr = `{${binToHex(arr.join(""))}}`;
    return outStr;
};

export class GameboyTileDesignerDocument implements vscode.CustomDocument {
    isDirty: boolean = false;
    uri: vscode.Uri;
    tileData: number[][] = [];
    uniqueId: string = '';
    constructor(uri: vscode.Uri, tileData: number[][]) {
        this.uri = uri;
        this.tileData = tileData;
        this.uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    }


    dispose(): void {

    }

}

export class GameBoyTileDesignerProvider implements vscode.CustomEditorProvider<GameboyTileDesignerDocument> {

    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<GameboyTileDesignerDocument>>();
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;
    private _webViewPanel?: vscode.WebviewPanel;

    constructor(private context: vscode.ExtensionContext) {

    }

    openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): GameboyTileDesignerDocument | Thenable<GameboyTileDesignerDocument> {

        var px = new Promise<GameboyTileDesignerDocument>((resolve, reject) => {

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

                var gbtd = new GameboyTileDesignerDocument(uri, tileData);
                console.log("open custom document", gbtd.uniqueId, crc32(JSON.stringify(gbtd.tileData)));
                resolve(gbtd);
            });


        });

        return px;


    }

    saveCustomDocument(document: GameboyTileDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        return new Promise((resolve, reject) => {
            console.log("Save Custom Document", document.uniqueId, crc32(JSON.stringify(document.tileData)));
            document.isDirty = false;
            const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
            vscode.workspace.fs.writeFile(document.uri, data).then(() => {
                resolve();
            });
        });
    }
    saveCustomDocumentAs(document: GameboyTileDesignerDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {

        return new Promise((resolve, reject) => {
            console.log("Save Custom Document As", document.uniqueId, crc32(JSON.stringify(document.tileData)));
            document.isDirty = false;
            const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.join(',')}`).join('\n'));
            vscode.workspace.fs.writeFile(destination, data).then(() => {
                resolve();
            });
        });

    }
    revertCustomDocument(document: GameboyTileDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        return Promise.resolve();
    }
    backupCustomDocument(document: GameboyTileDesignerDocument, context: vscode.CustomDocumentBackupContext, cancellation: vscode.CancellationToken): Thenable<vscode.CustomDocumentBackup> {
        return new Promise((resolve, reject) => { });
    }



    resolveCustomEditor(document: GameboyTileDesignerDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {

        console.log("Resolve Custom Editor", document.uniqueId, crc32(JSON.stringify(document.tileData)));

        webviewPanel.webview.options = {
            enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor', 'public')]
        };

        this._webViewPanel = webviewPanel;
        webviewPanel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'export_tiles') {
                var newURI = document.uri.path.replace('.gbtd', '.c');
                vscode.window.showSaveDialog({ saveLabel: 'Export C File', defaultUri: vscode.Uri.from({ scheme: document.uri.scheme, path: newURI }), title: 'Export C File' })
                    .then((uri) => {
                        if (uri) {
                            let cFile = `const unsigned char ${uri.path.split('/').at(-1)?.split('.').at(0)}[256][16] = {${msg.tiles.map((tx: number[]) => pixelsToCByteArray(tx) + "\n")}};`;
                            vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
                        }
                    });
            }
            if (msg.command === 'save_tiles') {
                document.tileData = msg.tiles;
                console.log("Save Tiles", document.uniqueId, crc32(JSON.stringify(document.tileData)));
                this.saveCustomDocument(document, token);
            }
            if (msg.command === 'dirty_tiles') {
                document.tileData = msg.tiles;
                document.isDirty = true;
                this.onDidChangeCustomDocument((e) => {
                    e.document.isDirty = true;
                    e.document.tileData = msg.tiles;
                });

            }

        });



        const publicLocation = vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor', 'public');
        vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.html')).then((html) => {

            vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.js')).then((js) => {
                webviewPanel.webview.html = html.toString().split('<script src="index.js"></script>').join(`<script src="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(publicLocation, 'index.js'))}"></script>`);
                webviewPanel.webview.postMessage({ command: 'set_tiles', tiles: document.tileData });
                //
            });
        });

        webviewPanel.webview.postMessage({ command: 'set_tiles', tiles: document.tileData });

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
