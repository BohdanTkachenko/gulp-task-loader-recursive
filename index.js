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

      var taskFn;
      var dependencies;

      if (!task) {
        return;
      }

      taskFn = typeof task === 'function' ? task : typeof task.default === 'function' ? task.default : function () {};
      dependencies = typeof task.dependencies === 'object' ? task.dependencies : null;

      if (dependencies) {
        gulp.task(taskName, dependencies, taskFn);
      } else {
        gulp.task(taskName, taskFn);
      }
    }
  });
}

module.exports = initTasks;
