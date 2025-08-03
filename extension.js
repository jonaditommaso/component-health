const vscode = require('vscode');
const { countFunctionDeclarations } = require('./src/count')
const { functionInfos } = require('./src/utils/functionsInfo');
const { getLines } = require('./src/getLines');
const { calculateHealth } = require('./src/utils/calculateHealth');

class MyCodeLensProvider {
	constructor(message) {
        this.message = message;
        this.registration = undefined;
    }

    provideCodeLenses(document, token) {
        // Suppress unused parameter warnings
        document;
        token;

        const position = new vscode.Position(0, 0);
        const range = new vscode.Range(position, position);

        const codeLens = new vscode.CodeLens(range, {
            title: this.message,
            command: '',
        });

        return [codeLens];
    }

	register(language) {
        this.registration = vscode.languages.registerCodeLensProvider({ scheme: 'file', language }, this);
    }

    unregister() {
        if (this.registration) {
            this.registration.dispose();
			this.registration = undefined;
        }
    }
}

function activate(context) {
	let activeCodeLensProvider;

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
				const metrics = {
					linesOfCode: 0,
					useEffectCount: 0,
					useStateCount: 0,
					functionalComponentCount: 0
				};

				functionInfos.forEach((functionInfo, index) => {
					const isEnabled = functionConfig[functionInfo.name];
					if (!isEnabled) {
						return;
					}

					const hookCount = countFunctionDeclarations(text, functionInfo.name, fileName);

					// Store metrics for health calculation
					if (functionInfo.name === 'useEffect') {
						metrics.useEffectCount = hookCount;
					} else if (functionInfo.name === 'useState') {
						metrics.useStateCount = hookCount;
					} else if (functionInfo.name === 'functionalComponent') {
						metrics.functionalComponentCount = hookCount;
					}

					message += `${functionInfo.message} ${hookCount}`;
					if (index < functionInfos.length - 1) {
						message += ' | ';
					}
				});

				if (worspaceConfig.get("enableLinesOfCodeView")) {
					const linesOfCode = getLines(text, fileName);
					metrics.linesOfCode = linesOfCode;
					message += ` | Code lines: ${linesOfCode}`;
				}

				// Calculate and add health score
				const healthScore = calculateHealth(metrics);
				message += ` | Health: ${healthScore}%`;

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
function deactivate() {}

module.exports = {
	activate,
	deactivate
}