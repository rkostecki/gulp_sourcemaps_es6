var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');//

var uglify = require('gulp-uglify');
var uglifyjs       = require('gulp-uglifyjs');
var path         = require('path');

gulp.task('js', function () {
    var bundler = browserify({
        extensions: ['.jsx', '.js'],
        entries: 'src/js/app.js',
        debug: true//,
        //commondir:      false,
        //insertGlobals:  true
    });

    bundler.transform(
        babelify.configure({
            extensions: ['.jsx'], //only .jsx files
            presets: ['es2015', 'react'],
            sourceMaps: true, //how to extract base64 maps?
            //ignore: /node_modules/
            //sourceMapsAbsolute: false
            compact: false
        })
    );
    bundler.bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('js/app.js'))
        .on('error', gutil.log)
        .pipe(gulp.dest(localPath));
    return bundler;
});