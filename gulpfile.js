var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var preprocess = require('gulp-preprocess');
var watch = require('gulp-watch');
var exorcist = require('exorcist');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var localPath = 'build/local';
var convert = require('convert-source-map');
var sourceify = require('sourceify');
var filter       = require('gulp-filter');
var path         = require('path');
var rename = require('gulp-rename');
var requireDir = require('require-dir');

// Require all tasks in gulp/, including subfolders
requireDir('./gulp', {recurse: true});

gulp.task('clean', function () {
    return gulp.src('./build/local/**')
        .pipe(clean({force: true}));
});

gulp.task('default', function () {
    return runSequence(['build'], function () {
        watch(['src/**/*.css', 'src/**/*.js', 'src/**/*.jsx',  'src/index.html'], function () {
            runSequence(['build']);
        });
    });
});

gulp.task('public', function () {
    // moving all public files
    gulp.src('./src/public/**')
        .pipe(plumber())
        .pipe(gulp.dest(localPath + '/public/'));
});

gulp.task('html', function () {
    return gulp.src('./src/index.html')
        .pipe(plumber())
        .pipe(gulp.dest(localPath));
});


gulp.task('convert', function() {
    var convert = require('convert-source-map');
    var json = convert
        .fromComment('//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JhZmFsL3Byb2plY3RzL2d1bHBfc291cmNlbWFwc19lczYvc3JjL2pzL2NvbXBvbmVudHMvVGVzdC5qc3giXSwibmFtZXMiOlsiVGVzdCIsImIiLCJhIiwidmFyaWFibGUiLCJwcm9wcyIsInByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBR3FCQSxJOzs7Ozs7Ozs7OztpQ0FDUjtBQUNMLGdCQUFNQyxJQUFJLENBQVY7QUFDQSxnQkFBTUMsSUFBSSxFQUFWO0FBRkssZ0JBR0VDLFFBSEYsR0FHYyxLQUFLQyxLQUhuQixDQUdFRCxRQUhGOztBQUlMLG1CQUNJO0FBQUE7QUFBQTtBQUNJO0FBQ0ksOEJBQVU7QUFEZCxrQkFESjtBQUdPRCxpQkFIUDtBQUFBO0FBR1dELGlCQUhYO0FBSUk7QUFBQTtBQUFBO0FBQUEsMkNBQTRCRTtBQUE1QjtBQUpKLGFBREo7QUFRSDs7Ozs7O2tCQWJnQkgsSTs7O0FBZ0JyQkEsS0FBS0ssU0FBTCxHQUFpQjtBQUNiRixjQUFVLGlCQUFVRyxNQUFWLENBQWlCQztBQURkLENBQWpCIiwiZmlsZSI6IlRlc3QuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50LCBQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBUZXN0MiBmcm9tICcuL1Rlc3QyJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGIgPSAxO1xuICAgICAgICBjb25zdCBhID0gMTE7XG4gICAgICAgIGNvbnN0IHt2YXJpYWJsZX0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8VGVzdDJcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFibGU9eydUZXN0J31cbiAgICAgICAgICAgICAgICAvPnthfSB7Yn1cbiAgICAgICAgICAgICAgICA8c3Bhbj57YEl0IHByaW50cyB0ZXN0IGluICR7dmFyaWFibGV9YH08L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cblRlc3QucHJvcFR5cGVzID0ge1xuICAgIHZhcmlhYmxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbn07XG4iXX0=')
        .toJSON();

    var modified = convert
        .fromComment('//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlcyI6WyJjb25zb2xlLmxvZyhcImhpXCIpOyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIvIn0=')
        .setProperty('sources', ['CONSOLE.LOG("HI");'])
        .toJSON();

    console.log(json);
    console.log(modified);

});

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true });
    src._read = function () {
        this.push(new gutil.File({
            cwd: "",
            base: "",
            path: filename,
            contents: new Buffer(string)
        }));
        this.push(null)
    };
    return src
}

gulp.task('convertapp', function() {
    var scan = require('gulp-scan');
    var convert = require('convert-source-map');
    var re = /(\/\/[ \t]*[@#][ \t]*sourceMappingURL=data:application\/json;base64,[a-zA-Z0-9\+=]+)/gi;
    console.log(re);
    var cv;
    var i = 0
    return gulp.src( './build/local/js/app.js.map')
        .pipe(scan({ term: re, fn: function (match) {
            cv  = convert.fromComment(match).toJSON();
            console.log(cv);
            //console.log(convert.fromComment(match).toObject());
            return string_src('map' + (i++) + '.js.map', cv)
                .pipe(gulp.dest(localPath + '/js/es6map'));
        }}));
});

gulp.task('combinesm', function() {
    var gulpMerge = require('gulp-merge');

    return gulpMerge(
        gulp.src('some/files/*.js')
            .pipe(doSomething())
            .pipe(concat('some-scripts.js')),
        gulp.src('some/other/files/*.js')
            .pipe(doSomethingElse())
            .pipe(concat('some-other-scripts.js'))
    )
        .pipe(concat('all-scripts.js'))
        .pipe(gulp.dest('dest'));
});


gulp.task('build', function (callback) {
    runSequence('clean',
        [
            'public',
            'html',
            'js_webpack_sm'
        ],
        callback);
});
