var gulp = require('gulp');

gulp.task('my task 1', function () {
 console.log('task 1');
});

gulp.task('my task 2', function () {
 console.log('task 2');
});

gulp.task('default', ['my task 1','my task 2'] , function () {
  console.log('hello gulp!');
});