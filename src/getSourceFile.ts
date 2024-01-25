import * as ts from 'typescript';

export const getSourceFile = (editorDocumentText: string, fileName: string) => {
    const sourceFile = ts.createSourceFile(fileName, editorDocumentText, ts.ScriptTarget.Latest, true);

    return sourceFile.text;
};