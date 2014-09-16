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

var instrn_q = new Array();

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
      instrn_q.push(that.shell);
      that.exec();
    })
    monitor.on("changed", function (f, curr, prev) {
      console.info('> file changed.'.blue);
      instrn_q.push(that.shell);
      that.exec();
    })
    monitor.on("removed", function (f, stat) {
      console.info('> file removed.'.red);
      instrn_q.push(that.shell);
      that.exec();
    })
  });

  that.exec();
}

watching.prototype.exec = function() {
  var that = this;

  console.info("++" + instrn_q.length);

  if (instrn_q.length <= 0){
    console.info("nothing to execute..");

    return;
  }

  exec(instrn_q.pop(), function(error, stdout, stderr) {
    console.info("///" + stdout + '\n> exec shell: ' + that.shell);

    // keep only last command since all are same
    if (instrn_q.length > 0){
      instrn_q = [that.shell];
    }

    that.exec();
  });
}

module.exports = watching;
