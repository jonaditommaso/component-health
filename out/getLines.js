"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLines = void 0;
const getSourceFile_1 = require("./getSourceFile");
const getLines = (textFile, fileName) => {
    const textContent = (0, getSourceFile_1.getSourceFile)(textFile, fileName);
    const lines = textContent.split('\n');
    return lines.length;
};
exports.getLines = getLines;
//# sourceMappingURL=getLines.js.map