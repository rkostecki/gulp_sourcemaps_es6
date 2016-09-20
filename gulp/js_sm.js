var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');//

var uglify = require('gulp-uglify');
var uglifyjs       = require('gulp-uglifyjs');
var path         = require('path');

var localPath = 'build/local';

gulp.task('js_sm', function () {
    return browserify({
        extensions: ['.jsx', '.js'],
        entries: 'src/js/app.js',
        debug: true
    })
        .transform(
            babelify.configure({
                extensions: ['.jsx'], //only .jsx files
                presets: ['es2015', 'react'],
                sourceMaps: true,
                sourceMapsAbsolute: false,
                compact: false
            })
        )
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('js/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true,
            debug: true,
            identityMap: true
        }))
        // .pipe(uglifyjs('app.js', {
        //     outSourceMap:  true,
        //     sourceMapIncludeSources: true
        // })) //minify file
        //.pipe(rename("main-min.js")) // rename file
        .pipe(sourcemaps.write('./' ,
            {
                sourceRoot: '/source',
                includeContent: true, // must be true
                addComment: true, // must be true
                debug: true
            }
        ))

        .pipe(gulp.dest(localPath));
    return bundler;
});