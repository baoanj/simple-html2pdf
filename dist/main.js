"use strict";

var html2canvas = require('html2canvas');

var jsPDF = require('jspdf');

module.exports = function () {
  return function (element, options, callback) {
    var defaultOptions = {
      filename: 'file.pdf',
      margin: 20
    };
    options = {}.toString.call(options) === '[object Object]' ? Object.assign({}, defaultOptions, options) : defaultOptions;
    if (typeof options === 'function') callback = options;
    html2canvas(element).then(function (canvas) {
      // canvas 宽度为 720px 最适合打印
      var CANVAS_PAGE_RATE = 720 / 446.46;
      var pdf = new jsPDF('p', 'px', 'a4');
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      var pageWidth = pdf.internal.pageSize.getWidth();
      var pageHeight = pdf.internal.pageSize.getHeight();
      var imgWidth = pageWidth - options.margin * 2;
      var imgHeight = pageHeight - options.margin * 2;
      var MAX_CANVAS_WIDTH = Number.parseInt(CANVAS_PAGE_RATE * imgWidth);
      var addImageWH = false;
      if (canvasWidth <= MAX_CANVAS_WIDTH) addImageWH = true;
      var position = 0;

      while (position <= canvasHeight) {
        var tempCanvas = document.createElement('canvas');
        var tempHeight = canvasWidth * imgHeight / imgWidth;
        tempCanvas.width = canvasWidth;
        tempCanvas.height = tempHeight;
        var tempCtx = tempCanvas.getContext('2d');
        var bodyCtx = canvas.getContext('2d');
        var imgData = bodyCtx.getImageData(0, position, canvasWidth, tempHeight);
        tempCtx.putImageData(imgData, 0, 0, 0, 0, canvasWidth, tempHeight);

        if (addImageWH) {
          pdf.addImage(tempCanvas.toDataURL("image/png"), 'PNG', options.margin, options.margin);
        } else {
          pdf.addImage(tempCanvas.toDataURL("image/png"), 'PNG', options.margin, options.margin, imgWidth, imgHeight);
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