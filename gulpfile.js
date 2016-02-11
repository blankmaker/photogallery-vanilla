'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('sass', function() {
  return gulp.src('styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('styles/build'));
});

gulp.task('concat-styles', function() {
  return gulp.src('styles/build/**/*.css')
    .pipe(concat('stylebundle.css'))
    .pipe(gulp.dest('build'));
});

gulp.task('sass:watch', function() {
  gulp.watch('styles/**/*.scss', ['sass', 'concat-styles']);
});