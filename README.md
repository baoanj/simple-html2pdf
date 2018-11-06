# Simple HTML2PDF
[![NPM Downloads](https://img.shields.io/npm/dm/simple-html2pdf.svg)](https://www.npmjs.org/package/simple-html2pdf)
[![NPM Version](https://img.shields.io/npm/v/simple-html2pdf.svg)](https://www.npmjs.org/package/simple-html2pdf)

Client-Side Simple html -> pdf converter using html2canvas and jsPDF.

## Usage
```shell
$ npm install simple-html2pdf --save
```

```js
import html2pdf from 'simple-html2pdf';

// html2pdf(element[, options][, callback])
html2pdf(document.getElementById('xxx'), {
  filename: 'file.pdf',
  margin: 40,
  smart: false // true: Smartly adjust content width
}, () => { console.log('finish!'); });
```