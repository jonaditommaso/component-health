import { REGEX } from './utils/regex';
import { FunctionAccepted } from './types/functionAccepted';
import { getSourceFile } from './getSourceFile';

export function countFunctionDeclarations(text: string, functionName: FunctionAccepted): number {

    let functionCount = 0;
    const textContent = getSourceFile(text);

    const lines = textContent.split('\n');
    const nonCommentedLines = lines.filter(line => !line.trim().startsWith('//'));
    const codeWithoutComments = nonCommentedLines.join('\n');

    const regex = REGEX[functionName];
    const matches = codeWithoutComments.match(regex);
    functionCount = matches ? matches.length : 0;

    return functionCount;
}