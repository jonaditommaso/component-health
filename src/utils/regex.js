const REGEX = {
    useEffect: /(?<!\bimport\s.*{[^}]*\b)useEffect\b(?![^}]*\b\})/g,
    useState: /(?<!\bimport\s.*{[^}]*\b)(useState|React\.useState)\b(?![^}]*\b\})/g,
    functionalComponent:/\b(?:function|const)\s+([A-Z][a-zA-Z\d]*)\s*\(.*\)|export\s+(?:const|function)\s+([A-Z][a-zA-Z\d]*)|\bexport\s+default\s+([A-Z][a-zA-Z\d]*)\b/g,
    
    // New metrics - improved regex to catch arrow functions without braces
    internalFunctions: /(?:const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\([^)]*\)\s*=>\s*[{]|const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*\([^)]*\)\s*=>\s*[^{;]+[;]?|function\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*[{])/g,
    // Updated: Now catches any JSX element, null, or simple values in conditional returns
    conditionalReturns: /^\s*if\s*\([^)]+\)\s+return\s+(?:<[^>]*>|null|['"`][^'"`]*['"`]|[a-zA-Z_$][a-zA-Z0-9_$]*)/gm,
    customHooks: /\buse[A-Z][a-zA-Z0-9]*\b/g
};

module.exports = {
    REGEX
}