import * as vscode from 'vscode';
import { countFunctionDeclarations } from './count';
import { functionInfos } from './utils/functionsInfo';
import { getLines } from './getLines';

class MyCodeLensProvider implements vscode.CodeLensProvider {
	private registration: vscode.Disposable | undefined;

	constructor(private readonly message: string) {}

    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] {
        const position = new vscode.Position(0, 0);
        const range = new vscode.Range(position, position);

        const codeLens = new vscode.CodeLens(range, {
            title: this.message,
            command: '',
        });

        return [codeLens];
    }

	register(language: string) {
        this.registration = vscode.languages.registerCodeLensProvider({ scheme: 'file', language }, this);
    }

    unregister() {
        if (this.registration) {
            this.registration.dispose();
			this.registration = undefined;
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
	let activeCodeLensProvider: MyCodeLensProvider | undefined;

	const registerCommands = () => {

		const generalInfo = vscode.commands.registerCommand('component-health.generalCount', () => {
			const editor = vscode.window.activeTextEditor;
			const worspaceConfig = vscode.workspace.getConfiguration("componentHealth");

			const functionConfig = {
				useEffect: worspaceConfig.get("enableUseEffectView"),
				useState: worspaceConfig.get("enableUseStateView"),
				functionalComponent: worspaceConfig.get("enableFunctionalComponentsView"),
			};


			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				let message = '';

				functionInfos.forEach((functionInfo, index) => {
					const isEnabled = functionConfig[functionInfo.name];
					if (!isEnabled) {
						return;
					}

					const hookCount = countFunctionDeclarations(text, functionInfo.name, fileName);
					message += `${functionInfo.message} ${hookCount}`;
					if (index < functionInfos.length - 1) {
						message += ' | ';
					}
				});

				if (worspaceConfig.get("enableLinesOfCodeView")) {
					message += ` | Code lines: ${getLines(text, fileName)}`;
				}

				if (activeCodeLensProvider) {
					activeCodeLensProvider.unregister();
				}

				// Crear una instancia de MyCodeLensProvider con el mensaje actual
				const codeLensProvider = new MyCodeLensProvider(message);

				// Registrar el proveedor para TypeScript (.ts) y JavaScript (.js) del documento actual
				codeLensProvider.register(editor.document.languageId);

				// Almacenar el proveedor activo para que se pueda liberar posteriormente
				activeCodeLensProvider = codeLensProvider;
			} else {
				vscode.window.showInformationMessage('Open a valid file to count hooks and more');
			}
		});

		const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (!editor) {
				if (activeCodeLensProvider) {
					activeCodeLensProvider.unregister();
					activeCodeLensProvider = undefined;
				}
			}
		});

		// TODO: PENDING REFACTOR. SAME STRUCTURE
		const useEffectInfo = vscode.commands.registerCommand('component-health.countUseEffect', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				const useEffectCount = countFunctionDeclarations(text, 'useEffect', fileName);
				vscode.window.showInformationMessage(`UseEffect hooks: ${useEffectCount}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count useEffect');
			}
		});

		const useStateInfo = vscode.commands.registerCommand('component-health.countUseState', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				const useStateCount = countFunctionDeclarations(text, 'useState', fileName);
				vscode.window.showInformationMessage(`useState hooks: ${useStateCount}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count useState');
			}
		});

		const componentsInfo = vscode.commands.registerCommand('component-health.countComponents', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				const componentsCount = countFunctionDeclarations(text, 'functionalComponent', fileName);
				vscode.window.showInformationMessage(`Functional components in this file: ${componentsCount}`);
			} else {
				vscode.window.showInformationMessage('Open a React file to count components');
			}
		});

		const linesInfo = vscode.commands.registerCommand('component-health.countLines', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				vscode.window.showInformationMessage(`Lines of code: ${getLines(text, fileName)}`);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count lines of code');
			}
		});

		context.subscriptions.push(generalInfo, editorChangeListener);
		context.subscriptions.push(useEffectInfo);
		context.subscriptions.push(useStateInfo);
		context.subscriptions.push(linesInfo);
		context.subscriptions.push(componentsInfo);
	};

	registerCommands();
}

// This method is called when your extension is deactivated
export function deactivate() {}
