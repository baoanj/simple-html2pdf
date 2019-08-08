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
  filename: 'file.pdf', // default 'file.pdf'
  margin: 40, // default 40, page margin
  save: true, // default true: Save as file
  output: '', // default '', jsPDF output type
  smart: true // default true: Smartly adjust content width
}, output => { console.log('finish!', output); });
```

```html
<script src="https://unpkg.com/simple-html2pdf"></script>
<script>
  // html2pdf(element[, options][, callback])
</script>
```

## Options
- output `string` `optional`

[jsPDF doc](https://raw.githack.com/MrRio/jsPDF/master/docs/jsPDF.html#output)

Possible values are 'save', 'arraybuffer', 'blob', 'bloburi'/'bloburl', 'datauristring'/'dataurlstring', 'datauri'/'dataurl', 'dataurlnewwindow', 'pdfobjectnewwindow', 'pdfjsnewwindow'.
