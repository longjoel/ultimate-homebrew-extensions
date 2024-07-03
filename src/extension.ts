import * as vscode from 'vscode';
import { GBAEmulatorProvider } from './GBAEmulatorProvider';
import { NESEmulatorProvider } from './NESEmulatorProvider';
import { SNESEmulatorProvider } from './SNESEmulatorProvider';

export function activate(context: vscode.ExtensionContext) {
    const gbaEmulator = vscode.window.registerCustomEditorProvider(
        'ultimate-homebrew-extensions.gba-emulator',
        new GBAEmulatorProvider(context),
        {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        }
    );
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

    const snesEmulator = vscode.window.registerCustomEditorProvider(
        'ultimate-homebrew-extensions.snes-emulator',
        new SNESEmulatorProvider(context),
        {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        }
    );
    context.subscriptions.push(snesEmulator);
}

export function deactivate() {}