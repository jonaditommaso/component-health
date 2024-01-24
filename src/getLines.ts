import { getSourceFile } from './getSourceFile';

export const getLines = (textFile: string) => {
    const textContent = getSourceFile(textFile);
    const lines = textContent.split('\n');
    return lines.length;
};