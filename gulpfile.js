var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var concatCss = require('gulp-concat-css');


gulp.task('clean', function(done) {
  del(['build'], done);
});

gulp.task('css', function () {
  gulp.src('css/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('build/'));
});

gulp.task('js', function() {
    var bundler = browserify({
        entries: ['./lib/Main.jsx'],
        transform: [reactify],
        debug: false,
        cache: {}, packageCache: {}, fullPaths: true
    });

    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () {
        var updateStart = Date.now();

        watcher.bundle()
        .pipe(source('main.js'))
        .pipe(streamify(uglify('main.js')))
        .pipe(gulp.dest('./build/'));

        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/'));
});


gulp.task('watch', function() {
    gulp.watch('css/*.css', ['css']);
});

gulp.task('default', ['watch', 'js', 'css']);
