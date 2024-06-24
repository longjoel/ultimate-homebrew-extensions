import * as vscode from 'vscode';
import { GBADocument } from './GBADocument';

export class GBAEmulatorProvider implements vscode.CustomReadonlyEditorProvider {

	public constructor(private readonly context: vscode.ExtensionContext) {
		this.context = context;
	}

	openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
		return new GBADocument(uri);
	}
	resolveCustomEditor(document: GBADocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {


	
		const mgbaJS = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'gba',  'mgba.js'));
		const mgbaWasm = webviewPanel.webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'gba',  'mgba.wasm'));
		var ctx = this.context;
		vscode.workspace.fs.readFile(document.uri).then((content) => {

			vscode.workspace.fs.readFile(vscode.Uri.joinPath(ctx.extensionUri, 'gba', 'index.html'))
				.then((html) => {

					vscode.workspace.fs.readFile(vscode.Uri.joinPath(ctx.extensionUri, 'gba','mgba.js')).then((mgbaJS) => {

let adjustedBinaryFile = mgbaJS.toString().replace(`wasmBinaryFile="mgba.wasm"`,`wasmBinaryFile="${mgbaWasm}"`);

					const htmlString = html.toString();
					const htmlWithData = htmlString.replace('%BASE%', 
						webviewPanel.webview.asWebviewUri(ctx.extensionUri).toString());

					const htmlWithMgbaJS = htmlWithData.replace('<!--MGBAJS-->', `<script unsafe-inline>${mgbaJS}</script>`);	
					const htmlWithMeta = htmlWithMgbaJS.replace('<!--SECURITY-->',
					
						`<meta
  http-equiv="Content-Security-Policy"
  content="default-src  ${webviewPanel.webview.cspSource}; img-src ${webviewPanel.webview.cspSource} https:; script-src ${webviewPanel.webview.cspSource}; style-src ${webviewPanel.webview.cspSource};")/>`);


					webviewPanel.webview.options = {
						enableScripts: true,
						localResourceRoots: [
						vscode.Uri.joinPath(ctx.extensionUri),
						vscode.Uri.joinPath(ctx.extensionUri, 'gba'),
						]
					};
					webviewPanel.webview.html = htmlWithMeta;
					webviewPanel.webview.postMessage({ type: 'init', content: content.toString() });

				});
			});

		});


	}

}
