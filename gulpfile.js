var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var preprocess = require('gulp-preprocess');
var path = 'build/local';
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var exorcist = require('exorcist');


gulp.task('default', function () {
    runSequence(['build'], function () {
        watch(['src/**/*.css', 'src/**/*.js', 'src/**/*.jsx',  'src/index.html'], function () {
            runSequence(['build']);
        });
    });
});

gulp.task('public', function () {
    // moving all public files
    gulp.src('./src/public/**')
        .pipe(plumber())
        .pipe(gulp.dest(path + '/public/'));
});

gulp.task('html', function () {
    gulp.src('./src/index.html')
        .pipe(plumber())
        .pipe(gulp.dest(path));
});

gulp.task('js', function () {
    var bundler = browserify({
        extensions: ['.jsx', '.js'],
        entries: 'src/js/app.js',
        debug: true
    });
    bundler.transform(
        babelify.configure({
            extensions: ['.jsx'], //only .jsx files
            presets: ['es2015', 'react'],
            sourceMaps: true,
            sourceMapsAbsolute: true
        })
    );

    bundler.bundle()
        .pipe(source('js/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path));
});

gulp.task('build', ['public', 'html', 'js'],  function () {

});