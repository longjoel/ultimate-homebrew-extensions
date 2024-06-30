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

        webviewPanel.webview.options = { enableScripts: true };

        

        webviewPanel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Gameboy Tile Designer</title>
        </head>
        <body>
        <script>
        const vscode = acquireVsCodeApi();
        
        function onClickExportCFile() {
            console.log('SEND${document.uri}');
            const msg = {
                command: 'ultimate-homebrew-extensions.gb-tile-editor.exportCFile',
                text: '${JSON.stringify(document)}'
            };
            console.log(JSON.stringify(msg));
            vscode.postMessage(msg);
        }
        </script>
        <button onclick='onClickExportCFile()'>${document.uri}</button>
        </body>
        `;

    }



}