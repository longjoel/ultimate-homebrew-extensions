
import * as vscode from 'vscode';

// const pixelsToCByteArray = (data: number[]) => {
//     const bitMap: Record<number, string> = { 0: "00", 1: "01", 2: "10", 3: "11" };
//     let arr = data.map((d) => bitMap[d]);
//     let outStr = `{${binToHex(arr.join(""))}}`;
//     return outStr;
// };

function pixelsToCByteArray(colorIndices: number[]): string {
    // Determine the number of bytes needed for the output
    const numBytes = Math.ceil(colorIndices.length * 2 / 8);
    const byteArray = new Uint8Array(numBytes);

    // Iterate through the color indices
    for (let i = 0; i < colorIndices.length; i++) {
        // Calculate the position within the byte array
        const byteIndex = Math.floor(i * 2 / 8);
        const bitOffset = (i * 2) % 8;

        // Pack two color indices into one byte
        if (bitOffset === 0) {
            byteArray[byteIndex] = colorIndices[i];
        } else {
            byteArray[byteIndex] |= (colorIndices[i] << bitOffset);
        }
    }

    // Convert byteArray to hexadecimal string array
    const hexArray = Array.from(byteArray, byte => '0x' + byte.toString(16).padStart(2, '0'));
    let outStr = `{${hexArray}}`;
    return outStr;
}

function convertToGBTileData(pxdata: number[][], tileName: string) {
    // Ensure pixelData length is exactly 64 (8x8 pixels)

    // Generate the C header file content
    let headerContent = `// ${tileName}.h\n\n`;
    headerContent += `#ifndef ${tileName.toUpperCase()}_H\n`;
    headerContent += `#define ${tileName.toUpperCase()}_H\n\n`;
    headerContent += `const unsigned char ${tileName}[${pxdata.length}][16] = {\n`;


    for (let i = 0; i < pxdata.length; i++) {

        let pixelData: number[] = pxdata[i];
        // Convert pixelData to 2bpp tile data format
        const tileData = [];
        for (let i = 0; i < 16; i++) {
            let byte1 = 0;
            let byte2 = 0;
            for (let j = 0; j < 8; j++) {
                const pixelIndex = i * 8 + j;
                const pixelValue = pixelData[pixelIndex] - 1; // Adjust pixel value to 0-3

                byte1 |= ((pixelValue & 1) << (7 - j));
                byte2 |= (((pixelValue >> 1) & 1) << (7 - j));
            }
            tileData.push(byte1, byte2);
        }

        headerContent += '{';
        // Add tile data bytes
        for (let i = 0; i < 16; i++) {
            headerContent += `    0x${tileData[i].toString(16).padStart(2, '0')},\n`;
        }

        headerContent += '},';

    }



    // Close the array and header guard
    headerContent += `};\n\n#endif // ${tileName.toUpperCase()}_H`;

    return headerContent;
}

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
                            let cFile = convertToGBTileData(msg.tiles, uri.path.split('/').at(-1)?.split('.').at(0) ?? 'data');//= `const unsigned char ${uri.path.split('/').at(-1)?.split('.').at(0)}[${msg.tiles.length}][16] = {${msg.tiles.map((tx: number[]) => pixelsToCByteArray(tx) + "\n")}};`;
                            vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
                        }
                    });
            }
            if (msg.command === 'save_tiles') {
                document.tileData = msg.tiles;
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
                webviewPanel.webview.html = html.toString()
                    .split('<div id="tile-data" data-tiles=""></div>')
                    .join(`<div id="tile-data" data-tiles="${JSON.stringify(document.tileData)}"></div>`)
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
