var gulp = require("gulp");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var plumber = require("gulp-plumber");
var server = require("browser-sync");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require('gulp-svgstore');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var run = require("run-sequence");
var del = require("del");
var webp = require("gulp-cwebp");
var minhtml = require("gulp-htmlmin");
var uglify = require("gulp-uglify-es").default;

gulp.task("webp", function() {
  gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp ())
  .pipe(gulp.dest("build/img"));
});

gulp.task("style", function(){
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task('html', function() {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(minhtml({ collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
  .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest('source/img'));
});

gulp.task('sprite', function() {
  return gulp.src('build/img/icons/icon-*.svg')
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img/icons'));
});

gulp.task('scripts', function() {
  return gulp.src('source/js/**/*.js')
  .pipe(rename('bundle.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/js'));
});

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "style",
    "scripts",
    "images",
    "sprite",
    'webp',
    "html",
    done
  );
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]);
  gulp.watch("source/js/**/*.js", ["scripts"]);
});
