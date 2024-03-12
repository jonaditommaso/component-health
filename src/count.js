const { REGEX } = require('./utils/regex');
const { getSourceFile } = require('./getSourceFile');

function countFunctionDeclarations(text, functionName, fileName) {

    let functionCount = 0;
    const textContent = getSourceFile(text, fileName);

    const lines = textContent.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');

    const regex = REGEX[functionName];
    const matches = codeWithoutComments.match(regex);
    functionCount = matches ? matches.length : 0;

    return functionCount;
}

module.exports = {
    countFunctionDeclarations
}