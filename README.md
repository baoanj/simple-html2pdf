# Simple HTML2PDF
[![NPM Downloads](https://img.shields.io/npm/dm/simple-html2pdf.svg)](https://www.npmjs.org/package/simple-html2pdf)
[![NPM Version](https://img.shields.io/npm/v/simple-html2pdf.svg)](https://www.npmjs.org/package/simple-html2pdf)

Client-side Simple HTML-to-PDF using html2canvas and jsPDF.

## Usage
```shell
$ npm install simple-html2pdf --save
# or
$ yarn add simple-html2pdf
```

```js
import html2pdf from 'simple-html2pdf';

// html2pdf(element[, options][, callback])
html2pdf(document.body, {
  filename: 'file.pdf',
  margin: 40,
  smart: true // true: Smartly adjust content width
}, () => { console.log('finish!'); });
```

```html
<script src="https://unpkg.com/simple-html2pdf"></script>
<script>
  // html2pdf(element[, options][, callback])
</script>
```