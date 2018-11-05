const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

module.exports = function () {
  return function (element, options, callback) {
    const defaultOptions = {
      filename: 'file.pdf',
      margin: 20
    };
    options = ({}).toString.call(options) === '[object Object]' ?
      Object.assign({}, defaultOptions, options) : defaultOptions;

    if (typeof options === 'function') callback = options;

    html2canvas(element).then(function (canvas) {
      // canvas 宽度为 720px 最适合打印
      const CANVAS_PAGE_RATE = 720 / 446.46;
      const pdf = new jsPDF('p', 'px', 'a4');
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - options.margin * 2;
      const imgHeight = pageHeight - options.margin * 2;
      const MAX_CANVAS_WIDTH = Number.parseInt(CANVAS_PAGE_RATE * imgWidth);
      
      let addImageWH = false;
      if (canvasWidth <= MAX_CANVAS_WIDTH) addImageWH = true;

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

        if (addImageWH) {
          pdf.addImage(tempCanvas.toDataURL("image/png"), 'PNG', options.margin,
            options.margin);
        } else {
          pdf.addImage(tempCanvas.toDataURL("image/png"), 'PNG', options.margin,
            options.margin, imgWidth, imgHeight);
        }

        position += tempHeight;
        if (position <= canvasHeight) {
          pdf.addPage();
        }
      }
      pdf.save(options.filename);
      if (typeof callback === 'function') callback();
    });
  }
};