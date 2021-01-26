//  First, import everything needed! :)
//  Gulp functions
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
//  Minify JS
const terser = require('gulp-terser');
//  Initialize local server
const browsersync = require('browser-sync').create();


//  Sass

//  Go into the mentioned folder, find scss files and compile them, apply postprocessing and save to location mentioned

function sassTask() {
    return src('app/scss/**/*.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }))
}

//  JS

function jsTask() {
    return src('app.js/**/*.js', { sourcemaps: true })
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }))
}

//  browserSync 

function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

//  Watch

function watchTask() {
    watch('*.html', browserSyncReload);
    watch(['app/scss/**/*scss', 'app/js/**/*.js'], series(
        sassTask,
        jsTask,
        browserSyncReload
    ))
}

//  Default

exports.default = series(
    sassTask,
    jsTask,
    browserSyncServe,
    watchTask
)