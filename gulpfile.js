// Importing Modules
const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const sourceMaps = require('gulp-sourcemaps');
sass.compiler = require('node-sass');

// Source Path
const sassSourcePath = './source/sass/*.scss';

// Output Path
const cssOutputPath = './build/';

// Sass Dev Task
function sassDev(cb) {
  return src(sassSourcePath)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(dest(cssOutputPath));
  cb();
}

// Sass Production Task
function sassBuild(cb) {
  return src(sassSourcePath)
    .pipe(sourceMaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(sourceMaps.write('./maps'))
    .pipe(dest(cssOutputPath));
  cb();
}

// Watch Task
function watchTask() {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    notify: false
  });
  watch(sassSourcePath, sassDev);
  watch(['public/*']).on('change', browserSync.reload);
}

// Exporting watch task
exports.watch = series(sassDev, watchTask);

// Exporting build task
exports.build = series(sassBuild);
