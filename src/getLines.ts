import { getSourceFile } from './getSourceFile';

export const getLines = (textFile: string, fileName: string) => {
    const textContent = getSourceFile(textFile, fileName);
    const lines = textContent.split('\n');
    return lines.length;
};