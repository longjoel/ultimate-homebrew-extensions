import * as vscode from 'vscode';

export interface TileData {
    tileIndex: number;
    tileAlias: string;
    data: number[];
}

export class GameboyTileDesignerDocument implements vscode.CustomDocument {
    uri: vscode.Uri;
    tileData: TileData[] = [];
    constructor(uri: vscode.Uri, tileData: TileData[] = []) {
        this.uri = uri;
        this.tileData = tileData;
    }

    dispose(): void {
        throw new Error('Method not implemented.');
    }

}

function ExportCFile(document: GameboyTileDesignerDocument): void {

    const cFile = document.tileData.map((tile) => {
        return `const unsigned char ${tile.tileAlias}[16] = {${tile.data.join(',')}};`;
    }).join('\n');
    vscode.window.showSaveDialog({ filters: { 'C Files': ['c'] } })
        .then((uri) => {
            if (uri) {
                vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
            }
        });
}

export class GameBoyTileDesignerProvider implements vscode.CustomEditorProvider<GameboyTileDesignerDocument> {
    onDidChangeCustomDocument: vscode.Event<vscode.CustomDocumentEditEvent<GameboyTileDesignerDocument>> | vscode.Event<vscode.CustomDocumentContentChangeEvent<GameboyTileDesignerDocument>>;

    constructor(private context: vscode.ExtensionContext) {


        this.onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<GameboyTileDesignerDocument>>().event;
    }
    openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): GameboyTileDesignerDocument | Thenable<GameboyTileDesignerDocument> {

        let tileData: TileData[] = [];
        vscode.workspace.fs.readFile(uri).then((data) => {
            const text = new TextDecoder().decode(data);
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const parts = line.split(',');
                if (parts.length === 3) {
                    tileData.push({
                        tileIndex: parseInt(parts[0]),
                        tileAlias: parts[1],
                        data: parts[2].split(',').map((x) => parseInt(x))
                    });
                }
            }
        });
        if (tileData.length === 0) {
            tileData = [
                {
                    tileIndex: 0,
                    tileAlias: 'Default',
                    data: new Array(16).fill(0)
                }
            ];
        }

        return new GameboyTileDesignerDocument(uri, tileData);
    }

    saveCustomDocument(document: GameboyTileDesignerDocument, cancellation: vscode.CancellationToken): Thenable<void> {

        const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.tileIndex},${tile.tileAlias},${tile.data.join(',')}`).join('\n'));
        vscode.workspace.fs.writeFile(document.uri, data);
        return Promise.resolve();
    }
    saveCustomDocumentAs(document: GameboyTileDesignerDocument, destination: vscode.Uri, cancellation: vscode.CancellationToken): Thenable<void> {

        const data = new TextEncoder().encode(document.tileData.map((tile) => `${tile.tileIndex},${tile.tileAlias},${tile.data.join(',')}`).join('\n'));
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

        webviewPanel.webview.options = { enableScripts: true , localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor','public')]};

        webviewPanel.webview.onDidReceiveMessage((msg) => {
            if (msg.command === 'exportCFile') {
                ExportCFile(JSON.parse(msg.text) as GameboyTileDesignerDocument);
            }
        });


        const publicLocation = vscode.Uri.joinPath(this.context.extensionUri, 'packages', 'ultimate-gb-tile-editor','public');
       vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.html')).then((html) => {

        vscode.workspace.fs.readFile(vscode.Uri.joinPath(publicLocation, 'index.min.js')).then((js) => {
            webviewPanel.webview.html = html.toString().split('<script src="index.js"></script>').join(`<script src="${webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(publicLocation, 'index.min.js'))}"></script>`);
            //
        }); });

    }



}