import * as ts from 'typescript';

export const getSourceFile = (editorDocumentText: string) => {
    const sourceFile = ts.createSourceFile('temp.ts', editorDocumentText, ts.ScriptTarget.Latest, true);

    return sourceFile.text;
};