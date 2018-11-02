const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'simple-html2pdf.js',
    path: path.resolve(__dirname, 'dist')
  }
};