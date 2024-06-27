// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GBAEmulatorProvider } from './GBAEmulatorProvider';
import { NESEmulatorProvider } from './NESEmulatorProvider';
import { GameboyEmulatorProvider } from './GameboyEmulatorProvider';
import { SNESEmulatorProvider } from './SNESEmulatorProvider';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const gbaEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gba-emulator', new GBAEmulatorProvider(context));
	context.subscriptions.push(gbaEmulator);

	const nesemulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.nes-emulator', new NESEmulatorProvider(context));
	context.subscriptions.push(nesemulator);

	const gbEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gb-emulator', new GameboyEmulatorProvider(context));
	context.subscriptions.push(gbEmulator);

	const snesEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.snes-emulator', new SNESEmulatorProvider(context));
	context.subscriptions.push(snesEmulator);
}

// This method is called when your extension is deactivated
export function deactivate() {}
