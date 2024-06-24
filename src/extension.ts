// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GBAEmulatorProvider } from './GBAEmulatorProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const gbaEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gba-emulator', new GBAEmulatorProvider(context));
	context.subscriptions.push(gbaEmulator);
}

// This method is called when your extension is deactivated
export function deactivate() {}
