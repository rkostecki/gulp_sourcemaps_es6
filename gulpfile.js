var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');//
//var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var preprocess = require('gulp-preprocess');
var watch = require('gulp-watch');
var exorcist = require('exorcist');
var mold = require('mold-source-map');
var fs = require('fs');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var localPath = 'build/local';
var convert = require('convert-source-map');
var sourceify = require('sourceify');
var extractor    = require('gulp-extract-sourcemap');
var uglify       = require('gulp-uglifyjs');
var filter       = require('gulp-filter');
var path         = require('path');

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

var bundler = browserify({
    extensions: ['.jsx', '.jS'],
    entries: 'src/js/app.js',
    debug: true
});

bundler.transform(
    babelify.configure({
        extensions: ['.jsx'], //only .jsx files
        presets: ['es2015', 'react'],
        sourceMaps: true, //how to extract base64 maps?
        sourceMapsAbsolute: true
        //compact: false
    })
);

bundler.transform(
   sourceify
);

gulp.task('js', function () {
    bundler.bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('js/app.js'))
        //.pipe(buffer())
        //.pipe(sourcemaps.init({ loadMaps: true, debug: true }))
        //.pipe(uglify())
        .on('error', gutil.log)
       // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(localPath));
    return bundler;
});

gulp.task('js_extract', function() {
    var exchange = {
        source_map: {
            file: 'app.js.map',
            root: '/js/',
            orig: ''
        }
    };

    bundler.bundle()
    .pipe(source('js/app.js'))
    .pipe(buffer())
    .pipe( extractor({
        basedir:                path.join(__dirname, 'dist'),
        removeSourcesContent:   true
    }) )
        .on('postextract', function(sourceMap){
            console.log(sourceMap);
            exchange.source_map.orig = sourceMap;
        })
        .pipe( filter('**/*.js*') )
        .pipe( uglify( 'app.min.js', {
            outSourceMap: true,
            basePath: './dist/',
            output: {
                source_map: exchange.source_map // it's necessary
                // to correct generate of a final source map
                // of an uglified javascript bundle
            }
        }) )
        .pipe( gulp.dest( localPath ) );
});

gulp.task('js_sm', function () {
    bundler.bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('js/app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true, debug: true, identityMap: true, includeContent: false }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./',
            {
                addComment: true,
                includeContent: true,
                mapSources: function(sourcePath) {
                // source paths are prefixed with '../src/'
                    return '../src/' + sourcePath;
                }
            }
        ))
        .pipe(gulp.dest(localPath));
    return bundler;
});


gulp.task('js_exorcist', function () {
  bundler.bundle()
        //.on('error', function(err) { console.error(err); this.emit('end'); })
        //.pipe(source('js/app.js'))
        .pipe(exorcist(localPath + '/js/app.js.map'))
        //.pipe(fs.createWriteStream(localPath +'/js/app.js'), 'utf8');
        .pipe(source('js/app.js'))
        //.pipe(buffer())
        //.pipe(sourcemaps.init({ loadMaps: true, debug: true }))
        //.pipe(uglify())
        //.on('error', gutil.log)
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(localPath));
});

gulp.task('js2', function () {

    return gulp.src(['src/**/*.jsx'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat('js/app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(localPath))

});

gulp.task('browserify', function(){
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
        .pipe(exorcist(localPath + '/app.js.map'))
        .pipe(source('js/app.js'))
        .pipe(gulp.dest(localPath));
});




gulp.task('js_sec', ['browserify'], function() {
    return gulp.src('app.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('js/app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./', {addComment: true /* the default */, sourceRoot: '/src'}))
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

gulp.task('build', function (callback) {
    runSequence('clean',
        [
            'public',
            'html',
            'js_extract',
        ],
        callback);
});
