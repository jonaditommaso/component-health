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
function activate(context) {
    const registerCommand = () => {
        const disposable = vscode.commands.registerCommand(`component-health.countHook`, () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const text = editor.document.getText();
                let message = '';
                functionsInfo_1.functionInfos.forEach((functionInfo, index) => {
                    const hookCount = (0, count_1.countFunctionDeclarations)(text, functionInfo.name);
                    message += `${functionInfo.message} ${hookCount}`;
                    if (index < functionsInfo_1.functionInfos.length - 1) {
                        message += ' | ';
                    }
                });
                message += ` | Code lines: ${(0, getLines_1.getLines)(text)}`;
                vscode.window.showInformationMessage(message);
            }
            else {
                vscode.window.showInformationMessage('Open a valid file to count hooks');
            }
        });
        context.subscriptions.push(disposable);
    };
    registerCommand();
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map