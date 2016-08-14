var browserify   = require('browserify'),
    babelify     = require('babelify'),
    babel        = require('babel-core/register'),
    gulp         = require('gulp'),
    uglify       = require('gulp-uglify'),
    clean        = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),
    concatCss    = require('gulp-concat-css'),
    watch        = require('gulp-watch'),
    less         = require('gulp-less'),
    cssmin       = require('gulp-cssmin'),
    source       = require('vinyl-source-stream'),
    buffer       = require('vinyl-buffer'),
    mocha        = require('gulp-mocha'),
    istanbul     = require('gulp-istanbul'),
    isparta      = require('isparta'),
    path         = require('path');

gulp.task('less', function () {
    return gulp.src('./less/global.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./less'));
});

gulp.task('autoprefix', ['less'], function() {
    return gulp.src('./less/global.css')
        .pipe(autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src('./neoink-ui/dist', {read: false})
        .pipe(clean());
});

gulp.task('concatCss', ['clean','autoprefix'],  function () {
    return gulp.src(['./neoink-ui/vendor/*.css','./neoink-ui/dist/*.css'])
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('./neoink-ui/dist'));
});

gulp.task('cssmin', ['concatCss'], function() {
    gulp.src('./neoink-ui/dist/bundle.css')
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'));
});

gulp.task('browserify', function () {
    return browserify({
        entries: './app.js',
        debug: true
    })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch(['./app.js','./js/*.js'], ['browserify']);
    gulp.watch(['./less/*.less'], ['autoprefix']);
});

gulp.task('pre-test', function () {
    return gulp.src(['./js/*.js'])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
    return gulp.src(['test/*.js'])
        .pipe(mocha({
            compilers: {
                js: babel
            }
        }))
        .pipe(istanbul.writeReports())
        // Enforce a coverage of at least 90%
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});