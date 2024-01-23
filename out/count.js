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
exports.countFunctionDeclarations = void 0;
const ts = __importStar(require("typescript"));
function countFunctionDeclarations(text, functionName) {
    const sourceFile = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, true);
    let functionCount = 0;
    function count(text) {
        const regex = /(?<!\bimport\s.*{[^}]*\b)useEffect\b(?![^}]*\b\})/g;
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    }
    functionCount = count(sourceFile.text);
    return functionCount;
}
exports.countFunctionDeclarations = countFunctionDeclarations;
//# sourceMappingURL=count.js.map