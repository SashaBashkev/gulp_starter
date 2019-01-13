// Define required packages
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  inject = require('gulp-inject'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  browserify = require('gulp-browserify'),
  clean = require('gulp-clean'),
  sourcemaps = require('gulp-sourcemaps'),
  htmlMin = require('gulp-html-minifier'),
  browserSync = require('browser-sync');

// Entry and output files paths
const src = './src/';
const dist = './dist/';

// ===================
// ==== GULP TASKS ===
// ===================

// SASS
gulp.task('sass', () => {
  gulp.src(src + 'assets/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({ basename: 'styles' }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + 'assets/css'))
    .pipe(browserSync.stream())
});

// MINIFY JS
gulp.task('js', () => {
  gulp.src(src + 'assets/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat('global.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(browserify({
      insertGlobals: true,
      debug: !gulp.env.production
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist + 'assets/js'))
    .pipe(browserSync.stream());
});

// MINIFY HTML
gulp.task('html', () => {
  gulp.src(dist + '*.html', { force: true })
    .pipe(clean())
  gulp.src(src + '*.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
});

// GULP WATCH
gulp.task('default', () => {
  browserSync.init({
    notify: false,
    server: './dist'
  })
  gulp.watch([src + '*.html'], ['html'])
  gulp.watch([src + 'assets/sass/*.scss'], ['sass'])
  gulp.watch([src + 'assets/js/*.js'], ['js'])
})