import * as vscode from 'vscode';
import { countFunctionDeclarations } from './count';
import { functionInfos } from './utils/functionsInfo';
import { getLines } from './getLines';

export function activate(context: vscode.ExtensionContext) {

	const registerCommands = () => {
		const editor = vscode.window.activeTextEditor;

		const generalInfo = vscode.commands.registerCommand('component-health.generalCount', () => {
			const worspaceConfig = vscode.workspace.getConfiguration("componentHealth");

			const functionConfig = {
				useEffect: worspaceConfig.get("enableUseEffectView"),
				useState: worspaceConfig.get("enableUseStateView"),
				functionalComponent: worspaceConfig.get("enablefunctionalComponentsView"),
			};


			if (editor) {
				const text = editor.document.getText();
				let message = '';

				functionInfos.forEach((functionInfo, index) => {
					const isEnabled = functionConfig[functionInfo.name];
					if (!isEnabled) {
						return;
					}

					const hookCount = countFunctionDeclarations(text, functionInfo.name);
					message += `${functionInfo.message} ${hookCount}`;
					if (index < functionInfos.length - 1) {
						message += ' | ';
					}
				});

				if (worspaceConfig.get("enableLinesOfCodeView")) {
					message += ` | Code lines: ${getLines(text)}`;
				}

				vscode.window.showInformationMessage(message);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count hooks and more');
			}
		});

		const useEffectInfo = vscode.commands.registerCommand('component-health.countUseEffect', () => {
			if (editor) {
				const text = editor.document.getText();
				const useEffectCount = countFunctionDeclarations(text, 'useEffect');
				vscode.window.showInformationMessage(`UseEffect hooks: ${useEffectCount}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count useEffect');
			}
		});

		const useStateInfo = vscode.commands.registerCommand('component-health.countUseState', () => {
			if (editor) {
				const text = editor.document.getText();
				const useStateCount = countFunctionDeclarations(text, 'useState');
				vscode.window.showInformationMessage(`useState hooks: ${useStateCount}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count useState');
			}
		});

		const componentsInfo = vscode.commands.registerCommand('component-health.countComponents', () => {
			if (editor) {
				const text = editor.document.getText();
				const componentsCount = countFunctionDeclarations(text, 'functionalComponent');
				vscode.window.showInformationMessage(`Functional components in this file: ${componentsCount}`);
			} else {
				vscode.window.showInformationMessage('Open a React file to count components');
			}
		});

		const linesInfo = vscode.commands.registerCommand('component-health.countLines', () => {
			if (editor) {
				const text = editor.document.getText();
				vscode.window.showInformationMessage(`Lines of code: ${getLines(text)}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count lines of code');
			}
		});

		context.subscriptions.push(generalInfo);
		context.subscriptions.push(useEffectInfo);
		context.subscriptions.push(useStateInfo);
		context.subscriptions.push(linesInfo);
		context.subscriptions.push(componentsInfo);
	};

	registerCommands();
}

// This method is called when your extension is deactivated
export function deactivate() {}
