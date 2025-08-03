const { REGEX } = require('./utils/regex');
const { getSourceFile } = require('./getSourceFile');
const { calculateJSXNestingDepth, countCustomHooksExcludingImports, countInternalFunctions } = require('./utils/advancedAnalysis');

function countFunctionDeclarations(text, functionName, fileName) {

    let functionCount = 0;
    const textContent = getSourceFile(text, fileName);

    const lines = textContent.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');

    // Handle special cases for new metrics
    if (functionName === 'jsxNesting') {
        return calculateJSXNestingDepth(textContent);
    }
    
    if (functionName === 'customHooks') {
        return countCustomHooksExcludingImports(textContent, REGEX.customHooks);
    }
    
    if (functionName === 'internalFunctions') {
        return countInternalFunctions(textContent, REGEX.internalFunctions);
    }

    const regex = REGEX[functionName];
    const matches = codeWithoutComments.match(regex);
    functionCount = matches ? matches.length : 0;

    return functionCount;
}

module.exports = {
    countFunctionDeclarations
}