var
   gulp = require('gulp'),
   gutil = require('gulp-util'),
   del = require('del'),
   merge = require('merge-stream'),
   browserSync = require('browser-sync'),
   config = require('./gulpconfig'),
   job = config.job;


gulp.task('clean', function () {
   // Удаляем предыдущую сборку
   del.sync(config.outputPaths());
});

gulp.task('browser-sync', function () {
    browserSync({
        proxy: "localhost:8082",
        port: 8083
    });
});

gulp.task('styles', function () {
   var
      sass = gulp.src(config.inputPaths('sass'), {base: "./"}).pipe(job.sass()),
      css = gulp.src(config.inputPaths('css'), {base: "./"});

   return merge(sass, css)
      .pipe(job.formatPath())
      .pipe(job.concat('styles.css'))
      .on('error', gutil.log)
      .pipe(gulp.dest('./'))
      .pipe(browserSync.reload({stream: true}));
});


gulp.task('scripts', function () {
   return gulp.src(config.inputPaths('js'), {base: "./"})
//      .pipe(job.print())
      .pipe(job.formatPath())
      .pipe(job.concat('finstat.js'))
      .pipe(gulp.dest('./'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('markup', function () {
   var
      pug = gulp.src(config.inputPaths('pug'), {base: "./"}).pipe(job.pug({pretty: true})),
      html = gulp.src(config.inputPaths('html'), {base: "./"});

   return merge(pug, html)
      .pipe(job.formatPath())
      .on('error', gutil.log)
      .pipe(gulp.dest('./'))
      .pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function () {
   return gulp.src(config.inputPaths('png'), {base: "./"})
      .pipe(job.formatPath())
      .pipe(job.imagemin({verbose: true}))
      .pipe(gulp.dest('./'));
});

gulp.task('vendor', function () {
   gulp.src(job.mainBowerFiles(['**/*', '!**/fonts/*.*']), {base: 'bower_components/'})
      .pipe(job.organizeBowerFiles())
      .pipe(gulp.dest(config.outputPaths({
         search: false,
         rootOnly: true,
         sub: '/vendor'
      })));

   gulp.src(job.mainBowerFiles('**/fonts/*.*'))
//      .pipe(job.print())
      .pipe(gulp.dest(config.outputPaths({
         search: false,
         rootOnly: true,
         sub: '/fonts'
      })));
});

gulp.task('watch', function () {
   gulp.watch(config.inputPaths('js'), ['scripts']);
   gulp.watch(config.inputPaths('css'), ['styles']);
   gulp.watch(config.inputPaths('sass'), ['styles']);
   gulp.watch(config.inputPaths('pug'), ['markup']);
   gulp.watch(config.inputPaths('html'), ['markup']);
   gulp.watch(config.inputPaths('png'), ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);
gulp.task('build', ['clean', 'scripts', 'styles', 'markup', 'vendor', 'images']);