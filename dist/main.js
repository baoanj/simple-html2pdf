"use strict";

var html2canvas = require('html2canvas');

var jsPDF = require('jspdf');

module.exports = function () {
  return function (element, options, callback) {
    var defaultOptions = {
      filename: 'file.pdf',
      margin: 40,
      smart: false
    };
    options = {}.toString.call(options) === '[object Object]' ? Object.assign({}, defaultOptions, options) : defaultOptions;
    if (typeof options === 'function') callback = options;
    var BEST_WIDTH = 795; // 元素宽度 + 2 * margin = 795 最适合打印

    var BEST_ELEMENT_WIDTH = BEST_WIDTH - 2 * options.margin;
    var freeElement = element;

    if ({}.toString.call(element) === '[object HTMLBodyElement]') {
      options.smart = false;
    }

    if (options.smart) {
      freeElement = element.cloneNode(true);
      var printCC = document.createElement('div');
      printCC.style.position = 'fixed';
      printCC.style.left = 0;
      printCC.style.top = 0;
      printCC.style.opacity = 0;
      printCC.style.zIndex = -1;
      printCC.appendChild(freeElement);
      element.parentNode.appendChild(printCC);

      if (freeElement.offsetWidth < freeElement.scrollWidth) {
        freeElement.style.width = "".concat(freeElement.scrollWidth + freeElement.offsetWidth - freeElement.clientWidth, "px");
      } else if (freeElement.offsetWidth > BEST_ELEMENT_WIDTH) {
        freeElement.style.width = "".concat(BEST_ELEMENT_WIDTH, "px");

        if (freeElement.offsetWidth < freeElement.scrollWidth) {
          freeElement.style.width = "".concat(freeElement.scrollWidth + freeElement.offsetWidth - freeElement.clientWidth, "px");
        }
      }
    }

    html2canvas(freeElement).then(function (canvas) {
      var pdf = new jsPDF('p', 'px', 'a4');
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      var pageWidth = pdf.internal.pageSize.getWidth();
      var pageHeight = pdf.internal.pageSize.getHeight();
      var pageMargin = Number.parseInt(options.margin * pageWidth / BEST_WIDTH);
      var imgWidth = pageWidth - 2 * pageMargin;
      var imgHeight = pageHeight - 2 * pageMargin;
      var addImageWH = false;
      if (canvasWidth <= BEST_ELEMENT_WIDTH) addImageWH = true;
      var position = 0;

      while (position <= canvasHeight) {
        var tempCanvas = document.createElement('canvas');
        var tempHeight = Math.max(BEST_ELEMENT_WIDTH, canvasWidth) * imgHeight / imgWidth;
        tempCanvas.width = canvasWidth;
        tempCanvas.height = tempHeight;
        var tempCtx = tempCanvas.getContext('2d');
        var bodyCtx = canvas.getContext('2d');
        var imgData = bodyCtx.getImageData(0, position, canvasWidth, tempHeight);
        tempCtx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, tempHeight);
        var tempCanvasData = tempCanvas.toDataURL("image/png");

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
  };
};