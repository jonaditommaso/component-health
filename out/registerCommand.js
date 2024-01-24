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
exports.registerCommand = void 0;
const vscode = __importStar(require("vscode"));
const count_1 = require("./count");
const registerCommand = (functionInfo, context) => {
    const disposable = vscode.commands.registerCommand(`component-health.countHook.${functionInfo.name}`, () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            const hookCount = (0, count_1.countFunctionDeclarations)(text, functionInfo.name);
            vscode.window.showInformationMessage(`${functionInfo.message}: ${hookCount}`);
        }
        else {
            vscode.window.showInformationMessage(`Open a valid file to count ${functionInfo.message}`);
        }
    });
    context.subscriptions.push(disposable);
};
exports.registerCommand = registerCommand;
//# sourceMappingURL=registerCommand.js.map