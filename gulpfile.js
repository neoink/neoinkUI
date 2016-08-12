var browserify   = require('browserify'),
    babelify     = require('babelify'),
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
    path         = require('path');

gulp.task('less', function () {
    return gulp.src('./css/global.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('autoprefix', ['less'], function() {
    return gulp.src('./css/global.css')
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
        entries: './index.js',
        debug: true
    })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch(['./*.js','./js/*.js',], ['browserify']);
    gulp.watch(['./css/*.less'], ['autoprefix']);
});