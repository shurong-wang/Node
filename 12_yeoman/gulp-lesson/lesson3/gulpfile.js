var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var mocha = require('gulp-mocha');

gulp.task('mocha test', function () {
    return gulp.src('./src/test2.js')
    .pipe(mocha());
});

gulp.task('default', ['mocha test'], function () {
    return gulp.src('./src/test1.js')
    .pipe(jasmine());
});