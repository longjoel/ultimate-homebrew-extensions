import * as vscode from 'vscode';
import { GBAEmulatorProvider } from './GBAEmulatorProvider';
import { NESEmulatorProvider } from './NESEmulatorProvider';
import { SNESEmulatorProvider } from './SNESEmulatorProvider';

import { GameBoyTileDesignerProvider, GameboyTileDesignerDocument } from './gameboy-tile-designer';
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {

    const gbaEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gba-emulator', new GBAEmulatorProvider(context), {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    });
    context.subscriptions.push(gbaEmulator);

    const nesEmulator = vscode.window.registerCustomEditorProvider(
        'ultimate-homebrew-extensions.nes-emulator',
        new NESEmulatorProvider(context),
        {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        }
    );
    context.subscriptions.push(nesEmulator);

    const snesEmulator = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.snes-emulator', new SNESEmulatorProvider(context), {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    });
    context.subscriptions.push(snesEmulator);

    const gameboyTileDesigner = vscode.window.registerCustomEditorProvider('ultimate-homebrew-extensions.gb-tile-editor', new GameBoyTileDesignerProvider(context), {
        webviewOptions: {
            retainContextWhenHidden: true,
            enableFindWidget:false
        },
        supportsMultipleEditorsPerDocument: false
    });
    context.subscriptions.push(gameboyTileDesigner);
}

export function deactivate() { }