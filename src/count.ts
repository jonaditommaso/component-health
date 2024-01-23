import * as ts from 'typescript';

export function countFunctionDeclarations(text: string, functionName: string): number {
    const sourceFile = ts.createSourceFile('temp.ts', text, ts.ScriptTarget.Latest, true);

    let functionCount = 0;

    function count(text: string): number {
        const regex = /(?<!\bimport\s.*{[^}]*\b)useEffect\b(?![^}]*\b\})/g;
        const matches = text.match(regex);
        return matches ? matches.length : 0;
    }

    functionCount = count(sourceFile.text);

    return functionCount;
}