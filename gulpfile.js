'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         }
//     });
// });

// or...

gulp.task('browser-sync', function() {

    browserSync.init(null, {
        proxy: "http://localhost:3001", // port of node server
    });

    // browserSync.init({
    //     server: "./"
    // });

    gulp.watch("assets/scss/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("assets/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);