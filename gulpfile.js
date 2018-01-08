'use strict';

var gulp       = require('gulp'),
    rename     = require("gulp-rename"),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    http       = require('http'),
    st         = require('st'),
    template   = require('gulp-template'),
    data       = require('gulp-data');

var development = false;

var listOfJSFiles = 
    ["scripts/Promise.js"
    ,"scripts/jquery-1.12.1.min.js"
    ,"scripts/jquery-ui.min.js"
    ,"scripts/VSS.SDK.js"
    ,"scripts/TableLock.js"
    ,"scripts/DateHealpers.js"
    ,"scripts/DropPlanHelper.js"
    ,"scripts/arrows.js"
    ,"scripts/themes.js"
    ,"scripts/DropPlanVSS.js"]

gulp.task('tracking', function(){
    var files = ['scripts/ga.js', 'scripts/trackjs.js'];
    if (development)
    {
        files = ['scripts/development.js'];
    }
    return gulp.src(files)
    .pipe(concat('tracking.js'))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('concat-js', function(){
    if (!development)
    {
        listOfJSFiles.splice(0,0, "scripts/prodructionData.js");
    }
    else
    {
        listOfJSFiles.splice(0,0, "scripts/date.polyfill.js");
        listOfJSFiles.splice(0,0, "scripts/testData.js");

    }

    return gulp.src(listOfJSFiles)
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('concat-css', function(){
    return gulp.src(['styles/main.css', 'styles/jquery-ui.css'])
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', ['concat-js'], function() {
    return gulp.src(['./dist/all.js'])
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(rename({extname: '.min.js'}))
      .pipe(sourcemaps.write('.', {addComment: false}))
      .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['concat-css', 'scripts', 'tracking']);

gulp.task('dev', function (done){
    development = true;
    
    gulp.run('default');

    http.createServer(
        st({ path: '.', index: 'index.html', cache: false })
    ).listen(8080, done);
});

gulp.task('publish', function (done){
    development = false;
    gulp.run('default');
});