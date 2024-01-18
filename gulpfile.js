const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');


function style() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS()) // Minificar CSS
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.stream());
}


function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify()) 
        .pipe(gulp.dest('dist/js/'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "/index.html"
        }
    });
    gulp.watch('src/scss/**/*.scss', style);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch('*.html').on('change', browserSync.reload);
}

// create a 'dev' task that runs both 'style' and 'scripts'
gulp.task('dev', gulp.parallel(style, scripts));
gulp.task('watch', watch);

// export 'style', 'scripts', and 'watch' tasks
exports.style = style;
exports.scripts = scripts;
exports.watch = watch;
