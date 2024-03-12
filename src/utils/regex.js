const REGEX = {
    useEffect: /(?<!\bimport\s.*{[^}]*\b)useEffect\b(?![^}]*\b\})/g,
    useState: /(?<!\bimport\s.*{[^}]*\b)(useState|React\.useState)\b(?![^}]*\b\})/g,
    functionalComponent:/\b(?:function|const)\s+([A-Z][a-zA-Z\d]*)\s*\(.*\)|export\s+(?:const|function)\s+([A-Z][a-zA-Z\d]*)|\bexport\s+default\s+([A-Z][a-zA-Z\d]*)\b/g
};

module.exports = {
    REGEX
}