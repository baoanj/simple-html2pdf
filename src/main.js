const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

module.exports = function () {
  return function (element, options, callback) {
    const defaultOptions = {
      filename: 'file.pdf',
      margin: 40,
      smart: false
    };
    options = ({}).toString.call(options) === '[object Object]' ?
      Object.assign({}, defaultOptions, options) : defaultOptions;

    if (typeof options === 'function') callback = options;

    const BEST_WIDTH = 795; // 元素宽度 + 2 * margin = 795 最适合打印
    const BEST_ELEMENT_WIDTH = BEST_WIDTH - 2 * options.margin;

    let freeElement = element;

    if (({}).toString.call(element) === '[object HTMLBodyElement]') {
      options.smart = false;
    }
    if (options.smart) {
      freeElement = element.cloneNode(true);
      const printCC = document.createElement('div');
      printCC.style.position = 'fixed';
      printCC.style.left = 0;
      printCC.style.top = 0;
      printCC.style.opacity = 0;
      printCC.style.zIndex = -1;
      printCC.appendChild(freeElement);
      element.parentNode.appendChild(printCC)

      if (freeElement.offsetWidth < freeElement.scrollWidth) {
        freeElement.style.width = `${freeElement.scrollWidth + freeElement.offsetWidth -
          freeElement.clientWidth}px`;
      } else if (freeElement.offsetWidth > BEST_ELEMENT_WIDTH) {
        freeElement.style.width = `${BEST_ELEMENT_WIDTH}px`;
        if (freeElement.offsetWidth < freeElement.scrollWidth) {
          freeElement.style.width = `${freeElement.scrollWidth + freeElement.offsetWidth -
            freeElement.clientWidth}px`;
        }
      }
    }

    html2canvas(freeElement).then(function (canvas) {
      const pdf = new jsPDF('p', 'px', 'a4');
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const pageMargin = Number.parseInt(options.margin * pageWidth / BEST_WIDTH);
      const imgWidth = pageWidth - 2 * pageMargin;
      const imgHeight = pageHeight - 2 * pageMargin;

      let addImageWH = false;
      if (canvasWidth <= BEST_ELEMENT_WIDTH) addImageWH = true;

      let position = 0;
      while (position <= canvasHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempHeight = Math.max(BEST_ELEMENT_WIDTH, canvasWidth) * imgHeight / imgWidth;
        tempCanvas.width = canvasWidth;
        tempCanvas.height = tempHeight;
        const tempCtx = tempCanvas.getContext('2d');
        const bodyCtx = canvas.getContext('2d');
        const imgData = bodyCtx.getImageData(0, position, canvasWidth, tempHeight);
        tempCtx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, tempHeight);

        const tempCanvasData = tempCanvas.toDataURL("image/png");
        if (addImageWH) {
          pdf.addImage(tempCanvasData, 'PNG', pageMargin, pageMargin);
        } else {
          pdf.addImage(tempCanvasData, 'PNG', pageMargin, pageMargin, imgWidth, imgHeight);
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
