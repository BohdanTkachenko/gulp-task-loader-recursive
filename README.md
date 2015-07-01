# gulp-task-loader-recursive
Easily organize gulp tasks in separate files and folders. It accepts any file extension that can be required by node.

## Update
Please note, that version 1.1.0 breaking changes. Now you should pass gulp as a first argument. See examples in Usage section below.

## Install
```npm install --save-dev gulp-task-loader-recursive```

## Files structure
You can create files and directories under ```tasks/``` folder. For example:
```
|-- gulpfile.js
|-- tasks/
    |-- build/
        |-- css.js
        |-- js.js
    |-- watch/
        |-- public.js
    |-- build.js
    |-- default.js
    |-- serve.js
```

And as a result you'll have following tasks:
```
build:css
build:js
watch:public
build
default
serve
```

You can define tasks as follows:
```
var gulp = require('gulp');

module.exports = function () {
  gulp.src('./src')
    .pipe(gulp.dest('./dst'))
  ;
};
```

Also you can provide tasks dependencies:
```
module.exports.dependencies = [ 'build:css' ];
```

## Usage
To be able to use this tasks you need to add the following to your gulpfile.js:
```
var gulp = require('gulp');
require('gulp-task-loader-recursive')(gulp);
```

If you want to use other tasks directory, just pass it as a parameter:
```
var gulp = require('gulp');
require('gulp-task-loader-recursive')(gulp, './gulp-tasks');
```

You can also provide prefix for all tasks loaded by this method:
```
var gulp = require('gulp');
require('gulp-task-loader-recursive')(gulp, null, 'custom:tasks:prefix');
```
