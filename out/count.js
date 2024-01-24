"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countFunctionDeclarations = void 0;
const regex_1 = require("./utils/regex");
const getSourceFile_1 = require("./getSourceFile");
function countFunctionDeclarations(text, functionName) {
    let functionCount = 0;
    const textContent = (0, getSourceFile_1.getSourceFile)(text);
    const lines = textContent.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');
    const regex = regex_1.REGEX[functionName];
    const matches = codeWithoutComments.match(regex);
    functionCount = matches ? matches.length : 0;
    return functionCount;
}
exports.countFunctionDeclarations = countFunctionDeclarations;
//# sourceMappingURL=count.js.map