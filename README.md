# Simple HTML2PDF
Client-Side Simple html -> pdf converter using html2canvas and jsPDF.

## Usage
```shell
$ npm install simple-html2pdf --save
```

```js
import html2pdf from 'simple-html2pdf';

// html2pdf(element[, options][, callback])
html2pdf(document.body, {
  filename: 'file.pdf',
  margin: 20
}, () => { console.log('finish!'); });
```