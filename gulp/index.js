var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var del = require('del')
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var jade = require('gulp-jade')
var uglify = require('gulp-uglify')
var merge2 = require('merge2')
var templateCache = require('gulp-angular-templatecache')
var bower = require('main-bower-files')
var gulpFilter = require('gulp-filter')
var angularFilesort = require('gulp-angular-filesort')

const distPath = './dist/';

gulp.task('build', ['clean', 'js', 'styles']);
gulp.task('default', ['bower', 'build', 'watch']);

gulp.task('watch', () => {
  return gulp.watch('./src/**/*', ['build']);
})

gulp.task('clean', () => {
  return del.sync(distPath)
})

gulp.task('bower', function () {
  return gulp.src(bower())
    .pipe(gulpFilter('**/*.js'))
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(distPath))
})

gulp.task('js', function () {
  return merge2(
    gulp.src('./src/**/*.js')
      .pipe(babel())
      .pipe(angularFilesort())
      .pipe(ngAnnotate()),

    gulp.src('./src/**/*.jade')
      .pipe(jade())
      .pipe(templateCache('_templates.js', {
        module: 'componentsTemplates',
        root: '/src',
        standalone:true
      }))
  )
  .pipe(concat('unicorn-ng-datepicker.js', {newLine: ';\n'}))
  .pipe(gulp.dest(distPath))
})

gulp.task('styles', function sassTask() {
  gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('unicorn-ng-datepicker.css'))
    .pipe(gulp.dest(distPath))
});
