/**
 * Advanced code analysis utilities for Component Health extension
 */

/**
 * Calculates the maximum JSX nesting depth in the code
 * @param {string} text - The code text to analyze
 * @returns {number} Maximum nesting depth
 */
function calculateJSXNestingDepth(text) {
    // Remove comments and strings to avoid false positives
    const cleanText = text
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/(['"`])[^\\]*?(?:\\.[^\\]*?)*?\1/g, ''); // Remove strings

    let maxDepth = 0;
    let currentDepth = 0;
    
    // Look for JSX patterns using a more robust approach
    const lines = cleanText.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Count opening JSX tags (including self-closing)
        const openTags = (trimmedLine.match(/<[A-Za-z][^>/]*(?!\/\s*>)/g) || []).length;
        
        // Count closing JSX tags
        const closeTags = (trimmedLine.match(/<\/[A-Za-z][^>]*>/g) || []).length;
        
        // Count self-closing tags (these don't increase depth)
        const selfClosingTags = (trimmedLine.match(/<[A-Za-z][^>]*\/\s*>/g) || []).length;
        
        // Adjust current depth
        currentDepth += (openTags - selfClosingTags);
        maxDepth = Math.max(maxDepth, currentDepth);
        currentDepth -= closeTags;
        
        // Ensure depth doesn't go negative
        currentDepth = Math.max(0, currentDepth);
    }
    
    return maxDepth;
}

/**
 * Filters custom hooks from import statements
 * @param {string} text - The code text to analyze
 * @param {RegExp} customHooksRegex - Regex to match custom hooks
 * @returns {number} Count of custom hooks excluding imports
 */
function countCustomHooksExcludingImports(text, customHooksRegex) {
    // Remove import statements
    const textWithoutImports = text.replace(/import\s+.*?from\s+['"][^'"]*['"];?/g, '');
    
    // Remove commented lines
    const lines = textWithoutImports.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');
    
    // Count custom hooks (excluding built-in React hooks)
    const matches = codeWithoutComments.match(customHooksRegex) || [];
    const builtInHooks = ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 'useDebugValue'];
    
    return matches.filter(hook => !builtInHooks.includes(hook)).length;
}

/**
 * Counts internal functions within components (excluding the component declaration itself)
 * @param {string} text - The code text to analyze
 * @param {RegExp} internalFunctionsRegex - Regex to match internal functions
 * @returns {number} Count of internal functions
 */
function countInternalFunctions(text, internalFunctionsRegex) {
    // Remove comments
    const lines = text.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');
    
    const matches = codeWithoutComments.match(internalFunctionsRegex) || [];
    
    // Filter out component declarations (functions/constants starting with uppercase)
    const filteredMatches = matches.filter(match => {
        // Extract the function/variable name from the match
        const nameMatch = match.match(/(?:function|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (nameMatch) {
            const functionName = nameMatch[1];
            // Only exclude if it starts with uppercase (component naming convention)
            return !/^[A-Z]/.test(functionName);
        }
        return true; // Keep if we can't determine the name
    });
    
    return Math.max(0, filteredMatches.length);
}

module.exports = {
    calculateJSXNestingDepth,
    countCustomHooksExcludingImports,
    countInternalFunctions
};
