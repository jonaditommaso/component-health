import * as vscode from 'vscode';
import { countFunctionDeclarations } from './count';
import { functionInfos } from './utils/functionsInfo';
import { getLines } from './getLines';

export function activate(context: vscode.ExtensionContext) {

	const registerCommand = () => {
		const disposable = vscode.commands.registerCommand(`component-health.countHook`, () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				let message = '';

				functionInfos.forEach((functionInfo, index) => {
					const hookCount = countFunctionDeclarations(text, functionInfo.name);
					message += `${functionInfo.message} ${hookCount}`;
					if (index < functionInfos.length - 1) {
						message += ' | ';
					}
				});

				message += ` | Code lines: ${getLines(text)}`;

				vscode.window.showInformationMessage(message);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count hooks');
			}
		});

		context.subscriptions.push(disposable);
	};

	registerCommand();
}

// This method is called when your extension is deactivated
export function deactivate() {}
