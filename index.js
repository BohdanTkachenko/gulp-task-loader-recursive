var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

function initTasks(dir, prefixStack) {
  dir = path.resolve(dir || 'tasks');
  prefixStack = prefixStack
    ? (typeof prefixStack === 'string' ? prefixStack.split(':') : prefixStack)
    : []
  ;

  var fileRe = /.js$/;

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    var
      filePath = path.join(dir, file),
      taskName, task
    ;

    if (fs.lstatSync(filePath).isDirectory()) {
      initTasks(filePath, prefixStack.concat([file]));
    } else if (fileRe.test(file)) {
      taskName = prefixStack.concat([ file.replace(fileRe, '') ]).join(':');

      task = require(filePath);
      if (typeof task !== 'function' && typeof task.dependencies !== 'object') {
        return;
      }

      if (typeof task !== 'function') {
        task = function () {};
      }

      if (typeof task.dependencies === 'object') {
        gulp.task(taskName, task.dependencies, task);
      } else {
        gulp.task(taskName, task);
      }
    }
  });
}

module.exports = initTasks;
