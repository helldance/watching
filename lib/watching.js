/* ================================================================
 * watching by xdf(xudafeng[at]126.com)
 *
 * first created at : Wed Aug 27 2014 16:53:54 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2014 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var exec = require('child_process').exec;
var watch = require('watch');
var path = require('path');
require('colorx');

function watching(cfg) {
  this.dir = cfg.dir;
  this.shell = cfg.shell;
  this.init();
}

watching.prototype.init = function() {
  var that = this;
  console.info('> watching start ...'.blue);
  var distDir = path.resolve(this.dir);
  watch.createMonitor(distDir, function (monitor) {
    monitor.on("created", function (f, stat) {
      console.info('> file created.'.blue);
      that.exec();
    })
    monitor.on("changed", function (f, curr, prev) {
      console.info('> file changed.'.blue);
      that.exec();
    })
    monitor.on("removed", function (f, stat) {
      console.info('> file removed.'.red);
      that.exec();
    })
  });
}

watching.prototype.exec = function() {
  var that = this;
  exec(this.shell, function(error, stdout, stderr) {
    console.info(stdout + '\n> exec shell.' + that.shell.gray);
  });
}

module.exports = watching;
