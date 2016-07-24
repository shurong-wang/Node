var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('default', function () {
    gulp.src('./src/index.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./dest'));
});