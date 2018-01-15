'use strict';

var gulp       = require('gulp'),
    rename     = require("gulp-rename"),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    http       = require('http'),
    st         = require('st'),
    livereload = require('gulp-livereload'),
    replace    = require('gulp-replace'),
    copy       = require('gulp-copy'),
    template   = require('gulp-template');

var css = {
    sourceFiles: ['styles/main.css', 'styles/jquery-ui.css'],
    fileName: 'dropPlan',
    environment: {
        dev:{
            path: './dist/dev/styles/',
            extension: '.css'
        },
        prod:{
            path: './dist/prod/styles/',
            extension: '.min.css'
        }
    }
};

var js = {
    sourceFiles: ["scripts/Promise.js"
    ,"scripts/jquery-1.12.1.min.js"
    ,"scripts/jquery-ui.min.js"
    ,"scripts/VSS.SDK.js"
    ,"scripts/TableLock.js"
    ,"scripts/DateHealpers.js"
    ,"scripts/DropPlanHelper.js"
    ,"scripts/arrows.js"
    ,"scripts/themes.js"
    ,"scripts/DropPlanVSS.js"],
    fileName: 'dropPlan',
    environment: {
        dev: {
            path: './dist/dev/scripts/',
            extension: '.js'
        },
        prod: {
            path: './dist/prod/scripts/',
            extension: '.min.js',
            sourceFiles: ["scripts/ga.js"
            ,"scripts/trackjs.js"]
        }
    }
};

gulp.task('concat-js', function(){
    return gulp.src(js.sourceFiles)
    .pipe(concat(js.fileName + js.environment.dev.extension))
    .pipe(gulp.dest(js.environment.dev.path))
    .pipe(livereload());
});

gulp.task('uglify-js', function(){
    return gulp.src([
          js.environment.prod.sourceFiles[0]
        , js.environment.prod.sourceFiles[1]
        , js.environment.dev.path + js.fileName + js.environment.dev.extension])
      .pipe(concat(js.fileName + js.environment.prod.extension))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('.', {addComment: false}))
      .pipe(gulp.dest(js.environment.prod.path));
});

gulp.task('concat-css', function(){
    return gulp.src(css.sourceFiles)
    .pipe(concat(css.fileName + css.environment.dev.extension))
    .pipe(gulp.dest(css.environment.dev.path))
    .pipe(livereload());
});

gulp.task('copy-css', function(){
    return gulp.src([css.environment.dev.path + css.fileName + css.environment.dev.extension])
      .pipe(rename({extname: css.environment.prod.extension}))
      .pipe(gulp.dest(css.environment.prod.path));
});

gulp.task('resource:dev', ['resource-css:dev', 'resource-static:dev', 'resource-html']);
gulp.task('resource:prod', ['resource-css:prod', 'resource-static:prod', 'resource-html', 'minified-resource-html']);
gulp.task('vsts:dev', function(){
    return gulp.src(['vss-extension-test.json'])
        .pipe(replace('{{URL}}', 'localhost:8080'))
        .pipe(rename('vss-extension.json'))
        .pipe(gulp.dest('./dist/dev/'));
});
gulp.task('vsts:prod', function(){
    return gulp.src(['vss-extension-real.json'])
        .pipe(rename('vss-extension.json'))
        .pipe(gulp.dest('./dist/prod/'));
});
gulp.task('resource-css:dev', function(){
    return gulp.src(['styles/*.css', '!styles/jquery-ui.css'])
        .pipe(copy('./dist/dev/'));
});
gulp.task('resource-css:prod', function(){
    return gulp.src(['styles/*.css', '!styles/jquery-ui.css'])
        .pipe(copy('./dist/prod/'));
});
gulp.task('resource-static:dev', function(){
    return gulp.src(['images/*', 'README.md'])
        .pipe(copy('./dist/dev/'));
});
gulp.task('resource-static:prod', function(){
    return gulp.src(['images/*', 'README.md'])
        .pipe(copy('./dist/prod/'));
});

gulp.task('resource-html', function(){
    return gulp.src(['index.html'])
        .pipe(replace(/#{now}/g, new Date().toJSON()))
        .pipe(gulp.dest('./dist/dev'));
});

gulp.task('minified-resource-html', function(){
    return gulp.src(['./dist/dev/index.html'])
        .pipe(replace('#{isMinified}', ''))
        .pipe(gulp.dest('./dist/prod'));
});



gulp.task('dev-resources', ['concat-js', 'concat-css', 'resource:dev', 'vsts:dev']);
gulp.task('prod-resources', ['uglify-js', 'copy-css', 'resource:prod', 'vsts:prod']);

gulp.task('default', ['dev-resources'], function(){gulp.run('prod-resources')});

gulp.task('watch', ['dev-resources'], function(done){
    livereload.listen();
    gulp.watch('scripts/*.js', ['concat-js']);
    gulp.watch('styles/*.css', ['concat-css', 'resource-css:dev']);

    http.createServer(
        st({ path: '.', index: 'index.html', cache: false })
    ).listen(8080, done);
});