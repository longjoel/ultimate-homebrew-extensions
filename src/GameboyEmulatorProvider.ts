import * as vscode from 'vscode';
import { ROMDocument } from './ROMDocument';

export class GameboyEmulatorProvider implements vscode.CustomReadonlyEditorProvider {

	public constructor(private readonly context: vscode.ExtensionContext) {
		this.context = context;
	}

	openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
		return new ROMDocument(uri);
	}
	resolveCustomEditor(document: ROMDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
		};

		webviewPanel.webview.html = `
<!doctype html>
<html lang="en">
  <head>
  
    <link rel="icon" type="image/png" href="https://nostalgist.js.org/favicon.png" />
    <script src="https://unpkg.com/nostalgist@0.9.2/dist/nostalgist.umd.js"></script>
  </head>
  <body>
    <script>
	(async function(){const nostalgist = await Nostalgist.launch({
  core: 'mgba',
  rom: '${webviewPanel.webview.asWebviewUri(document.uri)}',
	})})();
	</script>
  </body>
</html>
		`;

	}

}
