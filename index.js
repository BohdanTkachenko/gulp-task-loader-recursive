var fs = require('fs');
var path = require('path');

function initTasks(gulp, dir, prefixStack) {
  dir = path.resolve(dir || 'tasks');
  prefixStack = prefixStack
    ? (typeof prefixStack === 'string' ? prefixStack.split(':') : prefixStack)
    : []
  ;

  var extensions = Object.keys(require.extensions).map(function (ext) { return ext.replace(/^\.*/, ''); });
  var fileRe = new RegExp('\.(' + extensions.join('|') + ')$');

  var files = fs.readdirSync(dir);
  files.forEach(function (file) {
    var
      filePath = path.join(dir, file),
      taskName, task
    ;

    if (fs.lstatSync(filePath).isDirectory()) {
      initTasks(gulp, filePath, prefixStack.concat([file]));
    } else if (fileRe.test(file)) {
      taskName = prefixStack.concat([ file.replace(fileRe, '') ]).join(':');

      task = require(filePath);
      if (typeof task !== 'function' && typeof task.dependencies !== 'object') {
        return;
      }

      var dependencies = task.dependencies;
      if (typeof task !== 'function') {
        task = function () {};
      }

      if (typeof dependencies === 'object') {
        gulp.task(taskName, dependencies, task);
      } else {
        gulp.task(taskName, task);
      }
    }
  });
}

module.exports = initTasks;
