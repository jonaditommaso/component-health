const { getSourceFile } = require('./getSourceFile');

const getLines = (textFile, fileName) => {
    const textContent = getSourceFile(textFile, fileName);
    const lines = textContent.split('\n');
    return lines.length;
};

module.exports = {
    getLines
}