const func = require('./main.js');

(function (global, name, factory) {
  "use strict";

  // browser, script src, window.simpleHTML2PDF
  global[name] = factory.apply(this);
}(window, "simpleHTML2PDF", func));