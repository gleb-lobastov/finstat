var
   gulp = require('gulp'),
   del = require('del'),
   merge = require('merge-stream'),
   config = require('./gulpconfig'),
   job = config.job;


gulp.task('clean', function () {
   // Удаляем предыдущую сборку
   del.sync(config.outputPaths());
});


gulp.task('styles', function () {
   var
      sass = gulp.src(config.inputPaths('sass'), {base: "./"}).pipe(job.sass()),
      css = gulp.src(config.inputPaths('css'), {base: "./"});

   return merge(sass, css)
      .pipe(job.formatPath())
      .pipe(job.concat('styles.css'))
      .pipe(gulp.dest('./'));
});


gulp.task('scripts', function () {
   return gulp.src(config.inputPaths('js'), {base: "./"})
      .pipe(job.print())
      .pipe(job.formatPath())
      .pipe(job.concat('finstat.js'))
      .pipe(gulp.dest('./'));
});

gulp.task('markup', function () {
   return gulp.src(config.inputPaths('html'), {base: "./"})
      .pipe(job.formatPath())
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
   gulp.watch(config.inputPaths('sass'), ['styles']);
   gulp.watch(config.inputPaths('html'), ['markup']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['clean', 'scripts', 'styles', 'markup', 'vendor']);