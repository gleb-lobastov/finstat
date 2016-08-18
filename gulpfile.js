var
   gulp = require('gulp'),
   del = require('del'),
   config = require('./gulpconfig'),
   job = config.job;


gulp.task('clean', function () {
   // Удаляем предыдущую сборку
   del.sync(config.outputPaths());
});


gulp.task('styles', function () {
   return gulp.src(config.inputPaths('sass'), {base: "./"})
      .pipe(job.formatPath())
      .pipe(job.sass())
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


gulp.task('vendor', function () {
   gulp.src(job.mainBowerFiles(['**/*', '!**/fonts/*.*']))
      .pipe(job.print())
      .pipe(gulp.dest(config.outputPaths({
         search: false,
         rootOnly: true
      })));

   gulp.src(job.mainBowerFiles('**/fonts/*.*'))
      .pipe(job.print())
      .pipe(gulp.dest(config.outputPaths({
         search: false,
         rootOnly: true,
         sub: 'fonts'
      })));
});

// watch files for changes and reload
//gulp.task('serve', function () {
//   browserSync({
//      server: {
//         baseDir: 'app'
//      }
//   });
//
//   gulp.watch(['*.html', '**/static/**/*.css', '**/static/**/*.js'], {cwd: 'app'}, reload);
//});

// Watch Files For Changes
gulp.task('watch', function () {
//    gulp.watch('./src/script/**/*.js', ['lint', 'script']);
   gulp.watch('**/client/**/*.sass', ['styles']);
//    gulp.watch('./src/images/**', ['imagemin']);
//    gulp.watch('./templates/**/*.html').on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'scripts', 'styles', 'vendor']);