var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');//
var uglify = require('gulp-uglify');
var uglifyjs       = require('gulp-uglifyjs');
var path         = require('path');
var webpack = require('webpack-stream');

var localPath = 'build/local';
var webpackConfig = require('../webpack.config.js');

gulp.task('js_webpack_sm', function () {
    return gulp.src('src/js/app.js')
        .pipe(webpack(webpackConfig ))
        .pipe(gulp.dest(localPath + '/js'));
});
