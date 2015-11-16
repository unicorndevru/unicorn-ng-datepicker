var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var jade = require('gulp-jade')
var uglify = require('gulp-uglify')
var templateCache = require('gulp-angular-templatecache')

const srcPath = './src/';
const distPath = './dist/';
const partsPath = distPath + 'parts/';

gulp.task('watch', watchTask);

// Build Tasks //
gulp.task('js', jsTask);
gulp.task('sass', sassTask);
gulp.task('templates', templatesTask);
gulp.task('bundle', bundleTask);
gulp.task('build', ['js', 'sass', 'templates',  'bundle']);

// Default //
gulp.task('default', ['build', 'watch']);

function watchTask() {
  return gulp.watch('./src/**/*.*', ['build']);
}

function jsTask() {
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(concat('_modules.js', {newLine: ';\n'}))
    .pipe(gulp.dest(partsPath))
}

function templatesTask() {
  gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(templateCache('_templates.js', {
      module: 'componentsTemplates',
      root: '/src',
      standalone:true
    }))
    .pipe(gulp.dest(partsPath))
}

function sassTask() {
  gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('unicorn-ng-datepicker.css'))
    .pipe(gulp.dest(distPath))
}

function bundleTask() {
  gulp.src(partsPath + '**/*.js')
    .pipe(concat('unicorn-ng-datepicker.js', {newLine: ';\n'}))
    .pipe(uglify())
    .pipe(gulp.dest(distPath))
}
