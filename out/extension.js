"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const count_1 = require("./count");
const functionsInfo_1 = require("./utils/functionsInfo");
const getLines_1 = require("./getLines");
class MyCodeLensProvider {
    message;
    registration;
    constructor(message) {
        this.message = message;
    }
    provideCodeLenses(document, token) {
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
                functionalComponent: worspaceConfig.get("enablefunctionalComponentsView"),
            };
            if (editor) {
                const text = editor.document.getText();
                const fileName = editor.document.fileName;
                let message = '';
                functionsInfo_1.functionInfos.forEach((functionInfo, index) => {
                    const isEnabled = functionConfig[functionInfo.name];
                    if (!isEnabled) {
                        return;
                    }
                    const hookCount = (0, count_1.countFunctionDeclarations)(text, functionInfo.name, fileName);
                    message += `${functionInfo.message} ${hookCount}`;
                    if (index < functionsInfo_1.functionInfos.length - 1) {
                        message += ' | ';
                    }
                });
                if (worspaceConfig.get("enableLinesOfCodeView")) {
                    message += ` | Code lines: ${(0, getLines_1.getLines)(text, fileName)}`;
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
            }
            else {
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
                const useEffectCount = (0, count_1.countFunctionDeclarations)(text, 'useEffect', fileName);
                vscode.window.showInformationMessage(`UseEffect hooks: ${useEffectCount}`);
            }
            else {
                vscode.window.showInformationMessage('Open a valid file to count useEffect');
            }
        });
        const useStateInfo = vscode.commands.registerCommand('component-health.countUseState', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const text = editor.document.getText();
                const fileName = editor.document.fileName;
                const useStateCount = (0, count_1.countFunctionDeclarations)(text, 'useState', fileName);
                vscode.window.showInformationMessage(`useState hooks: ${useStateCount}`);
            }
            else {
                vscode.window.showInformationMessage('Open a valid file to count useState');
            }
        });
        const componentsInfo = vscode.commands.registerCommand('component-health.countComponents', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const text = editor.document.getText();
                const fileName = editor.document.fileName;
                const componentsCount = (0, count_1.countFunctionDeclarations)(text, 'functionalComponent', fileName);
                vscode.window.showInformationMessage(`Functional components in this file: ${componentsCount}`);
            }
            else {
                vscode.window.showInformationMessage('Open a React file to count components');
            }
        });
        const linesInfo = vscode.commands.registerCommand('component-health.countLines', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const text = editor.document.getText();
                const fileName = editor.document.fileName;
                vscode.window.showInformationMessage(`Lines of code: ${(0, getLines_1.getLines)(text, fileName)}`);
            }
            else {
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
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map