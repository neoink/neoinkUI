const browserify   = require('browserify'),
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
      eslint       = require('gulp-eslint'),
      path         = require('path');

gulp.task('less', () => {
    return gulp.src('./less/global.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./less'));
});

gulp.task('autoprefix', ['less'], () => {
    return gulp.src('./less/global.css')
        .pipe(autoprefixer({
            browsers: ['last 6 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
    return gulp.src('./neoink-ui/dist', {read: false})
        .pipe(clean());
});

gulp.task('concatCss', ['clean','autoprefix'], () => {
    return gulp.src(['./neoink-ui/vendor/*.css','./neoink-ui/dist/*.css'])
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest('./neoink-ui/dist'));
});

gulp.task('cssmin', ['concatCss'], () => {
    gulp.src('./neoink-ui/dist/bundle.css')
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'));
});

gulp.task('browserify',() => {
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

gulp.task('watch', () => {
    gulp.watch(['./app.js','./js/*.js'], ['lint', 'browserify']);
    gulp.watch(['./less/*.less'], ['autoprefix']);
});

gulp.task('lint', () => {
    return gulp.src([
        './app.js',
        './js/*.js',
        '!./js/vendor/**'
    ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('pre-test', () => {
    return gulp.src(['./js/*.js'])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
    return gulp.src(['test/*.js'])
        .pipe(mocha({
            compilers: {
                js: babel
            }
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});