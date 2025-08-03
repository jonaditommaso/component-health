const vscode = require('vscode');
const { countFunctionDeclarations } = require('./src/count')
const { functionInfos } = require('./src/utils/functionsInfo');
const { getLines } = require('./src/getLines');
const { calculateHealth } = require('./src/utils/calculateHealth');
const { getHealthIcon, getHealthStatus } = require('./src/utils/healthIcon');

class MyCodeLensProvider {
	constructor(message) {
        this.message = message;
        this.registration = undefined;
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
    }

    // Method to update the message without recreating the provider
    updateMessage(newMessage) {
        this.message = newMessage;
        // Trigger a refresh of the CodeLens by firing the onDidChangeCodeLenses event
        if (this.registration && this._onDidChangeCodeLenses) {
            this._onDidChangeCodeLenses.fire();
        }
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
        if (this._onDidChangeCodeLenses) {
            this._onDidChangeCodeLenses.dispose();
        }
    }
}

function activate(context) {
	let activeCodeLensProvider;
	let statusBarItem;
	let updateTimeout; // For debouncing updates

	// Debounced update function to prevent excessive updates
	const debounceUpdate = (editor, delay = 300) => {
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		updateTimeout = setTimeout(() => {
			if (editor && editor.document) {
				const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
				if (supportedLanguages.includes(editor.document.languageId)) {
					const text = editor.document.getText();
					const fileName = editor.document.fileName;

					const metrics = {
						linesOfCode: 0,
						useEffectCount: 0,
						useStateCount: 0,
						functionalComponentCount: 0,
						internalFunctionsCount: 0,
						conditionalReturnsCount: 0,
						jsxNestingDepth: 0,
						customHooksCount: 0
					};

					metrics.useEffectCount = countFunctionDeclarations(text, 'useEffect', fileName);
					metrics.useStateCount = countFunctionDeclarations(text, 'useState', fileName);
					metrics.functionalComponentCount = countFunctionDeclarations(text, 'functionalComponent', fileName);
					metrics.internalFunctionsCount = countFunctionDeclarations(text, 'internalFunctions', fileName);
					metrics.conditionalReturnsCount = countFunctionDeclarations(text, 'conditionalReturns', fileName);
					metrics.jsxNestingDepth = countFunctionDeclarations(text, 'jsxNesting', fileName);
					metrics.customHooksCount = countFunctionDeclarations(text, 'customHooks', fileName);
					metrics.linesOfCode = getLines(text, fileName);

					const healthScore = calculateHealth(metrics);
					updateStatusBar(healthScore);

					// If CodeLens is already visible, update it automatically
					if (activeCodeLensProvider && activeCodeLensProvider.registration) {
						console.log('Component Health: CodeLens is visible, updating automatically');
						updateCodeLens(editor, text, fileName, metrics, healthScore);
					}
				}
			}
		}, delay);
	};

	// Create status bar item
	const createStatusBarItem = () => {
		console.log('Component Health: Creating status bar item...');
		statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		// Add a dummy command to enable cursor pointer
		statusBarItem.command = 'component-health.statusBarClick';
		statusBarItem.tooltip = 'Component Health - Hover to configure metrics';
		context.subscriptions.push(statusBarItem);
		console.log('Component Health: Status bar item created successfully');
	};

	// Update status bar with health score
	const updateStatusBar = (healthScore) => {
		console.log('Component Health: updateStatusBar called with score:', healthScore);
		if (statusBarItem) {
			console.log('Component Health: Status bar item exists, updating...');
			// Use heart icon as fallback (we know this works in your extension)
			statusBarItem.text = `$(heart) ${healthScore}%`;
			statusBarItem.backgroundColor = undefined; // Reset background

			// Change background color based on health
			if (healthScore < 40) {
				statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
			} else if (healthScore < 60) {
				statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
			}

			// Create interactive tooltip with checkboxes
			const config = vscode.workspace.getConfiguration("componentHealth");
			const tooltip = new vscode.MarkdownString();
			tooltip.isTrusted = true;
			tooltip.supportHtml = false;

			// Add health icon to title
			const healthIcon = getHealthIcon(healthScore);
			tooltip.appendMarkdown(`**Component Health: ${healthScore}% ${healthIcon}**\n\n`);
			tooltip.appendMarkdown(`---\n\n`); // Divider
			tooltip.appendMarkdown(`**Choose metrics for CodeLens general view:**\n\n`);

			// Add checkboxes for each metric with simple icons
			const metrics = [
				{ key: 'enableUseEffectView', label: 'UseEffect Count' },
				{ key: 'enableUseStateView', label: 'UseState Count' },
				{ key: 'enableFunctionalComponentsView', label: 'Functional Components' },
				{ key: 'enableInternalFunctionsView', label: 'Internal Functions' },
				{ key: 'enableConditionalReturnsView', label: 'Conditional Returns' },
				{ key: 'enableJSXNestingView', label: 'JSX Nesting' },
				{ key: 'enableCustomHooksView', label: 'Custom Hooks' },
				{ key: 'enableLinesOfCodeView', label: 'Lines of Code' }
			];

			// Calculate current metrics for suggestions
			const editor = vscode.window.activeTextEditor;
			let currentMetrics = {};
			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;
				currentMetrics = {
					useEffectCount: countFunctionDeclarations(text, 'useEffect', fileName),
					useStateCount: countFunctionDeclarations(text, 'useState', fileName),
					functionalComponentCount: countFunctionDeclarations(text, 'functionalComponent', fileName),
					internalFunctionsCount: countFunctionDeclarations(text, 'internalFunctions', fileName),
					conditionalReturnsCount: countFunctionDeclarations(text, 'conditionalReturns', fileName),
					jsxNestingDepth: countFunctionDeclarations(text, 'jsxNesting', fileName),
					customHooksCount: countFunctionDeclarations(text, 'customHooks', fileName),
					linesOfCode: getLines(text, fileName)
				};
			}

			metrics.forEach(metric => {
				const isEnabled = config.get(metric.key);
				const icon = isEnabled ? '✅' : '⭕';
				tooltip.appendMarkdown(`[${icon} ${metric.label}](command:component-health.toggle.${metric.key} "Toggle ${metric.label}")\n\n`);
			});

			// Add suggestions section
			tooltip.appendMarkdown(`---\n\n`); // Another divider
			tooltip.appendMarkdown(`**💡 Suggestions:**\n\n`);

			const suggestions = [];

			if (currentMetrics.useEffectCount > 4) {
				suggestions.push(`⚠️ Your component has ${currentMetrics.useEffectCount} useEffect hooks. Consider if all are necessary or split into smaller components.`);
			}

			if (currentMetrics.useStateCount > 5) {
				suggestions.push(`⚠️ ${currentMetrics.useStateCount} useState hooks detected. Consider using useReducer for complex state management.`);
			}

			if (currentMetrics.linesOfCode > 300) {
				suggestions.push(`⚠️ This file has ${currentMetrics.linesOfCode} lines. Consider breaking it into smaller, more manageable components.`);
			}

			if (currentMetrics.internalFunctionsCount > 6) {
				suggestions.push(`⚠️ ${currentMetrics.internalFunctionsCount} internal functions found. Consider extracting some to custom hooks or utilities.`);
			}

			if (currentMetrics.jsxNestingDepth > 5) {
				suggestions.push(`⚠️ Deep JSX nesting detected (depth: ${currentMetrics.jsxNestingDepth}). Consider extracting nested components.`);
			}

			if (currentMetrics.conditionalReturnsCount > 3) {
				suggestions.push(`⚠️ Multiple conditional returns (${currentMetrics.conditionalReturnsCount}) found. Consider simplifying the component logic.`);
			}

			// Positive suggestions
			if (currentMetrics.customHooksCount > 0) {
				suggestions.push(`💡 Great! You're using ${currentMetrics.customHooksCount} custom hooks. This promotes code reusability.`);
			}

			if (healthScore >= 90) {
				suggestions.push(`💡 Excellent code health! Your component follows React best practices.`);
			} else if (healthScore >= 75) {
				suggestions.push(`💡 Good code health! Minor improvements could make it even better.`);
			}

			if (suggestions.length === 0) {
				suggestions.push(`💡 No specific suggestions. Your component looks well-structured!`);
			}

			suggestions.forEach(suggestion => {
				tooltip.appendMarkdown(`${suggestion}\n\n`);
			});

			// Add information section
			tooltip.appendMarkdown(`---\n\n`); // Another divider
			tooltip.appendMarkdown(`ℹ️ [How is the health score calculated?](https://marketplace.visualstudio.com/items?itemName=jonaditommaso.component-health "Learn about our scoring algorithm")\n\n`);

			statusBarItem.tooltip = tooltip;
			console.log('Component Health: About to show status bar item');
			statusBarItem.show();
			console.log('Component Health: Status bar item show() called successfully');
		} else {
			console.log('Component Health: ERROR - statusBarItem is null/undefined');
		}
	};

	// Hide status bar when no relevant file is open
	const hideStatusBar = () => {
		if (statusBarItem) {
			statusBarItem.hide();
		}
	};

	// Update CodeLens with current metrics
	const updateCodeLens = (editor, text, fileName, metrics, healthScore) => {
		const worspaceConfig = vscode.workspace.getConfiguration("componentHealth");

		const functionConfig = {
			useEffect: worspaceConfig.get("enableUseEffectView"),
			useState: worspaceConfig.get("enableUseStateView"),
			functionalComponent: worspaceConfig.get("enableFunctionalComponentsView"),
			internalFunctions: worspaceConfig.get("enableInternalFunctionsView"),
			conditionalReturns: worspaceConfig.get("enableConditionalReturnsView"),
			jsxNesting: worspaceConfig.get("enableJSXNestingView"),
			customHooks: worspaceConfig.get("enableCustomHooksView"),
		};

		let message = '';
		let hasEnabledMetrics = false;

		functionInfos.forEach((functionInfo, index) => {
			const isEnabled = functionConfig[functionInfo.name];
			if (!isEnabled) {
				return;
			}

			hasEnabledMetrics = true;
			let hookCount;

			// Use already calculated metrics if available, otherwise calculate
			if (functionInfo.name === 'useEffect') {
				hookCount = metrics.useEffectCount;
			} else if (functionInfo.name === 'useState') {
				hookCount = metrics.useStateCount;
			} else if (functionInfo.name === 'functionalComponent') {
				hookCount = metrics.functionalComponentCount;
			} else if (functionInfo.name === 'internalFunctions') {
				hookCount = metrics.internalFunctionsCount;
			} else if (functionInfo.name === 'conditionalReturns') {
				hookCount = metrics.conditionalReturnsCount;
			} else if (functionInfo.name === 'jsxNesting') {
				hookCount = metrics.jsxNestingDepth;
			} else if (functionInfo.name === 'customHooks') {
				hookCount = metrics.customHooksCount;
			} else {
				hookCount = countFunctionDeclarations(text, functionInfo.name, fileName);
			}

			message += `${functionInfo.message} ${hookCount}`;
			if (index < functionInfos.length - 1) {
				message += ' | ';
			}
		});

		if (worspaceConfig.get("enableLinesOfCodeView")) {
			const linesOfCode = metrics.linesOfCode;
			if (hasEnabledMetrics) {
				message += ` | Code lines: ${linesOfCode}`;
			} else {
				message = `Code lines: ${linesOfCode}`;
			}
		}

		// Add health score with icon
		const healthIcon = getHealthIcon(healthScore);
		const healthStatus = getHealthStatus(healthScore);
		if (message) {
			message += ` | Health: ${healthIcon} ${healthScore}% (${healthStatus})`;
		} else {
			message = `Health: ${healthIcon} ${healthScore}% (${healthStatus})`;
		}

		// If provider exists, just update the message, otherwise create new one
		if (activeCodeLensProvider && activeCodeLensProvider.registration) {
			activeCodeLensProvider.updateMessage(message);
		} else {
			// Create and register new CodeLens provider only if none exists
			if (activeCodeLensProvider) {
				activeCodeLensProvider.unregister();
			}

			const codeLensProvider = new MyCodeLensProvider(message);
			codeLensProvider.register(editor.document.languageId);
			activeCodeLensProvider = codeLensProvider;
		}
	};

	const registerCommands = () => {

		// Dummy command for status bar cursor pointer (doesn't do anything)
		const statusBarClick = vscode.commands.registerCommand('component-health.statusBarClick', () => {
			// Do nothing - this is just to enable cursor pointer
		});

		// Command to toggle metrics panel
		const toggleMetricsPanel = vscode.commands.registerCommand('component-health.toggleMetricsPanel', async () => {
			const config = vscode.workspace.getConfiguration("componentHealth");

			const options = [
				{
					label: `$(${config.get("enableUseEffectView") ? 'check' : 'circle-large-outline'}) UseEffect Count`,
					detail: 'Show useEffect hooks count in general view',
					configKey: 'enableUseEffectView'
				},
				{
					label: `$(${config.get("enableUseStateView") ? 'check' : 'circle-large-outline'}) UseState Count`,
					detail: 'Show useState hooks count in general view',
					configKey: 'enableUseStateView'
				},
				{
					label: `$(${config.get("enableFunctionalComponentsView") ? 'check' : 'circle-large-outline'}) Functional Components`,
					detail: 'Show functional component count in general view',
					configKey: 'enableFunctionalComponentsView'
				},
				{
					label: `$(${config.get("enableInternalFunctionsView") ? 'check' : 'circle-large-outline'}) Internal Functions`,
					detail: 'Show internal functions count in general view',
					configKey: 'enableInternalFunctionsView'
				},
				{
					label: `$(${config.get("enableConditionalReturnsView") ? 'check' : 'circle-large-outline'}) Conditional Returns`,
					detail: 'Show conditional returns count in general view',
					configKey: 'enableConditionalReturnsView'
				},
				{
					label: `$(${config.get("enableJSXNestingView") ? 'check' : 'circle-large-outline'}) JSX Nesting`,
					detail: 'Show JSX nesting depth in general view',
					configKey: 'enableJSXNestingView'
				},
				{
					label: `$(${config.get("enableCustomHooksView") ? 'check' : 'circle-large-outline'}) Custom Hooks`,
					detail: 'Show custom hooks count in general view',
					configKey: 'enableCustomHooksView'
				},
				{
					label: `$(${config.get("enableLinesOfCodeView") ? 'check' : 'circle-large-outline'}) Lines of Code`,
					detail: 'Show lines of code count in general view',
					configKey: 'enableLinesOfCodeView'
				}
			];

			const selected = await vscode.window.showQuickPick(options, {
				placeHolder: 'Toggle Component Health Metrics',
				canPickMany: false
			});

			if (selected) {
				const currentValue = config.get(selected.configKey);
				await config.update(selected.configKey, !currentValue, vscode.ConfigurationTarget.Global);
				vscode.window.showInformationMessage(`${selected.detail.replace('Show ', '').replace(' in general view', '')} ${!currentValue ? 'enabled' : 'disabled'}`);
			}
		});

		// Individual toggle commands for each metric
		const createToggleCommand = (configKey, displayName) => {
			return vscode.commands.registerCommand(`component-health.toggle.${configKey}`, async () => {
				const config = vscode.workspace.getConfiguration("componentHealth");
				const currentValue = config.get(configKey);
				await config.update(configKey, !currentValue, vscode.ConfigurationTarget.Global);

				// Refresh status bar tooltip
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
					if (supportedLanguages.includes(editor.document.languageId)) {
						// Recalculate health score to refresh tooltip
						const text = editor.document.getText();
						const fileName = editor.document.fileName;

						const metrics = {
							linesOfCode: getLines(text, fileName),
							useEffectCount: countFunctionDeclarations(text, 'useEffect', fileName),
							useStateCount: countFunctionDeclarations(text, 'useState', fileName),
							functionalComponentCount: countFunctionDeclarations(text, 'functionalComponent', fileName),
							internalFunctionsCount: countFunctionDeclarations(text, 'internalFunctions', fileName),
							conditionalReturnsCount: countFunctionDeclarations(text, 'conditionalReturns', fileName),
							jsxNestingDepth: countFunctionDeclarations(text, 'jsxNesting', fileName),
							customHooksCount: countFunctionDeclarations(text, 'customHooks', fileName)
						};

						const healthScore = calculateHealth(metrics);
						updateStatusBar(healthScore);
					}
				}

				vscode.window.showInformationMessage(`${displayName} ${!currentValue ? 'enabled' : 'disabled'}`);
			});
		};

		// Create toggle commands for each metric
		const toggleUseEffectView = createToggleCommand('enableUseEffectView', 'UseEffect Count');
		const toggleUseStateView = createToggleCommand('enableUseStateView', 'UseState Count');
		const toggleFunctionalComponentsView = createToggleCommand('enableFunctionalComponentsView', 'Functional Components');
		const toggleInternalFunctionsView = createToggleCommand('enableInternalFunctionsView', 'Internal Functions');
		const toggleConditionalReturnsView = createToggleCommand('enableConditionalReturnsView', 'Conditional Returns');
		const toggleJSXNestingView = createToggleCommand('enableJSXNestingView', 'JSX Nesting');
		const toggleCustomHooksView = createToggleCommand('enableCustomHooksView', 'Custom Hooks');
		const toggleLinesOfCodeView = createToggleCommand('enableLinesOfCodeView', 'Lines of Code');

		const generalInfo = vscode.commands.registerCommand('component-health.generalCount', () => {
			const editor = vscode.window.activeTextEditor;

			if (editor) {
				const text = editor.document.getText();
				const fileName = editor.document.fileName;

				const metrics = {
					linesOfCode: 0,
					useEffectCount: 0,
					useStateCount: 0,
					functionalComponentCount: 0,
					internalFunctionsCount: 0,
					conditionalReturnsCount: 0,
					jsxNestingDepth: 0,
					customHooksCount: 0
				};

				// Calculate all metrics
				metrics.useEffectCount = countFunctionDeclarations(text, 'useEffect', fileName);
				metrics.useStateCount = countFunctionDeclarations(text, 'useState', fileName);
				metrics.functionalComponentCount = countFunctionDeclarations(text, 'functionalComponent', fileName);
				metrics.internalFunctionsCount = countFunctionDeclarations(text, 'internalFunctions', fileName);
				metrics.conditionalReturnsCount = countFunctionDeclarations(text, 'conditionalReturns', fileName);
				metrics.jsxNestingDepth = countFunctionDeclarations(text, 'jsxNesting', fileName);
				metrics.customHooksCount = countFunctionDeclarations(text, 'customHooks', fileName);
				metrics.linesOfCode = getLines(text, fileName);

				// Calculate health score
				const healthScore = calculateHealth(metrics);

				// Update both status bar and CodeLens
				updateStatusBar(healthScore);
				updateCodeLens(editor, text, fileName, metrics, healthScore);
			} else {
				vscode.window.showInformationMessage('Open a valid file to count hooks and more');
				hideStatusBar();
			}
		});

		const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
			console.log('Component Health: Editor changed', editor && editor.document ? editor.document.fileName : 'No editor');

			if (!editor) {
				if (activeCodeLensProvider) {
					activeCodeLensProvider.unregister();
					activeCodeLensProvider = undefined;
				}
				hideStatusBar();
			} else {
				// Check if the file is a supported type (JS/TS/JSX/TSX)
				const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
				if (supportedLanguages.includes(editor.document.languageId)) {
					console.log('Component Health: Processing React file', editor.document.fileName);

					// Use debounce for consistency (this will update CodeLens if it was already visible)
					debounceUpdate(editor, 100); // Shorter delay for editor changes
				} else {
					console.log('Component Health: Not a React file, hiding status bar');
					// Hide CodeLens when switching to non-React files
					if (activeCodeLensProvider) {
						activeCodeLensProvider.unregister();
						activeCodeLensProvider = undefined;
					}
					hideStatusBar();
				}
			}
		});

		// Also add a listener for document changes to update health score in real-time
		const documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && event.document === editor.document) {
				console.log('Component Health: Document changed, debouncing update...');
				// Use debounce to prevent excessive updates
				debounceUpdate(editor, 500);
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

		context.subscriptions.push(generalInfo, editorChangeListener, documentChangeListener, toggleMetricsPanel, statusBarClick);
		context.subscriptions.push(useEffectInfo);
		context.subscriptions.push(useStateInfo);
		context.subscriptions.push(linesInfo);
		context.subscriptions.push(componentsInfo);

		// Add toggle commands to subscriptions
		context.subscriptions.push(toggleUseEffectView);
		context.subscriptions.push(toggleUseStateView);
		context.subscriptions.push(toggleFunctionalComponentsView);
		context.subscriptions.push(toggleInternalFunctionsView);
		context.subscriptions.push(toggleConditionalReturnsView);
		context.subscriptions.push(toggleJSXNestingView);
		context.subscriptions.push(toggleCustomHooksView);
		context.subscriptions.push(toggleLinesOfCodeView);
	};

	registerCommands();
	createStatusBarItem();

	// Immediate initialization when extension activates
	console.log('Component Health: Extension activated, checking for active editor');
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		console.log('Component Health: Found active editor on startup:', activeEditor.document.fileName);
		const supportedLanguages = ['javascript', 'typescript', 'javascriptreact', 'typescriptreact'];
		if (supportedLanguages.includes(activeEditor.document.languageId)) {
			console.log('Component Health: Active editor is React file, initializing immediately');
			// Use debounce for consistent behavior
			debounceUpdate(activeEditor, 100);
		} else {
			console.log('Component Health: Active editor is not a React file');
		}
	} else {
		console.log('Component Health: No active editor on startup');
	}
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}