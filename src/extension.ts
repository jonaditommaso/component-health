import * as vscode from 'vscode';
import { countFunctionDeclarations } from './count';

export function activate(context: vscode.ExtensionContext) {

	let countHookDisposable = vscode.commands.registerCommand('component-health.countHook', () => {

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const text = editor.document.getText();
			const hookCount = countFunctionDeclarations(text, 'useEffect');
			vscode.window.showInformationMessage(`UseEffect hooks: ${hookCount}`);
		} else {
			vscode.window.showInformationMessage('Open a valid file to count UseEffect hooks');
		}
	});

	context.subscriptions.push(countHookDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
