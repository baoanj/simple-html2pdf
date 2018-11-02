const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

(function (global, name, factory) {
  "use strict";

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && (define.amd || define.cmd)) {
    define(factory);
  } else {
    global[name] = factory.apply(this);
  }
}(this, "html2pdf", function () {
  function simpleHTML2PDF(element, options, callback) {
    const defaultOptions = {
      filename: 'file.pdf',
      margin: 20
    };
    options = ({}).toString.call(options) === '[object Object]' ?
      Object.assign({}, defaultOptions, options) : defaultOptions;

    if (typeof options === 'function') callback = options;
    
    html2canvas(element).then(function (canvas) {
      const pdf = new jsPDF('p', 'px', 'a4');
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - options.margin * 2;
      const imgHeight = pageHeight - options.margin * 2;

      let position = 0;
      while (position <= canvasHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempHeight = canvasWidth * imgHeight / imgWidth;
        tempCanvas.width = canvasWidth;
        tempCanvas.height = tempHeight;
        const tempCtx = tempCanvas.getContext('2d');

        const bodyCtx = canvas.getContext('2d');
        const imgData = bodyCtx.getImageData(0, position, canvasWidth, tempHeight);
        tempCtx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, tempHeight);

        pdf.addImage(tempCanvas.toDataURL("image/png"), 'PNG', options.margin,
          options.margin, imgWidth, imgHeight);
        
        position += tempHeight;
        if (position <= canvasHeight) {
          pdf.addPage();
        }
      }
      pdf.save(options.filename);
      if (typeof callback === 'function') callback();
    });
  }

  return simpleHTML2PDF;
}));