// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GBAEmulatorProvider } from './GBAEmulatorProvider';
import { NESEmulatorProvider } from './NESEmulatorProvider';
import { SNESEmulatorProvider } from './SNESEmulatorProvider';

import { GameBoyTileDesignerProvider, GameboyTileDesignerDocument } from './gameboy-tile-designer';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {

	function ExportCFile(document: GameboyTileDesignerDocument): void {
		const cFile = document.tileData.map((tile) => {
			return `const unsigned char ${tile.tileAlias}[16] = {${tile.data.join(',')}};`;
		}).join('\n');
		vscode.window.showSaveDialog({ filters: { 'C Files': ['c'] } }).then((uri) => {
			if (uri) {
				vscode.workspace.fs.writeFile(uri, new TextEncoder().encode(cFile));
			}
		});
	}
	
	
	const gbaEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gba-emulator', new GBAEmulatorProvider(context));
	context.subscriptions.push(gbaEmulator);

	const nesemulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.nes-emulator', new NESEmulatorProvider(context));
	context.subscriptions.push(nesemulator);

	const snesEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.snes-emulator', new SNESEmulatorProvider(context));
	context.subscriptions.push(snesEmulator);

	const gameboyTileDesigner = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gb-tile-editor', new GameBoyTileDesignerProvider(context));
	context.subscriptions.push(gameboyTileDesigner);

	context.subscriptions.push(vscode.commands.registerCommand('ultimate-homebrew-extensions.gb-tile-editor.exportCFile', ExportCFile));
}

// This method is called when your extension is deactivated
export function deactivate() {}
