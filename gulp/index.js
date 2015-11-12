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

gulp.task('watch', watchTask);

// Build Tasks //
gulp.task('js', jsTask);
gulp.task('sass', sassTask);
gulp.task('templates', templatesTask);
gulp.task('icons', iconsTask);
gulp.task('bundle', bundleTask);
gulp.task('build', ['js', 'sass', 'templates', 'icons', 'bundle']);

// Default //
gulp.task('default', ['build', 'watch']);

function watchTask() {
    return gulp.watch('./src/**', ['build']);
}

var jsFilename = 'unicorn-ng-datepicker.js';
function jsTask() {
  gulp.src('./src/**/*.js')
    .pipe(babel())
    .pipe(ngAnnotate())
    .pipe(concat(jsFilename, {newLine: ';\n'}))
    .pipe(gulp.dest(distPath))
}

function templatesTask() {
  gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(templateCache('templates.js', {
      module: 'componentsTemplates',
      root: '/src',
      standalone:true
    }))
    .pipe(gulp.dest(distPath))
}

function sassTask() {
  gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('unicorn-ng-datepicker.css'))
    .pipe(gulp.dest(distPath))
}

function iconsTask() {
  gulp.src('./src/**/*.svg')
    .pipe(templateCache('icons.js', {
      templateHeader: "(function(){\n  var factoryName = \"<%= module %>\".replace(/\.(\w)/, function(match){return match.toUpperCase}) + 'Cache'\n  angular.module(\"<%= module %>\"<%= standalone %>)\n  .factory(factoryName, ['$templateCache', function($templateCache){\n    var keys = []\n    return {\n      put: function(key, value){\n        keys.push(key)\n        return $templateCache.put(key, value);\n      },\n      keys: function(){\n        return keys;\n      }\n    }\n    }])\n  .run([factoryName, function($templateCache) {",
      templateFooter: "}]);})()",
      root: '/src',
      module: 'svgIcons',
      standalone: true
    }))
    .pipe(gulp.dest(distPath));
}

function bundleTask() {
  gulp.src(distPath + '**/*.js')
    .pipe(concat('all.js', {newLine: ';\n'}))
    .pipe(uglify())
    .pipe(gulp.dest(distPath))
}
