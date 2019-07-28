// Подключаем Gulp
var gulp = require("gulp");

// Подключаем плагины Gulp
var sass = require("gulp-sass"), // переводит SASS в CSS
    cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    imagemin = require('gulp-imagemin'), // Сжатие изображение
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"); // Переименование файлов
    del = require('del'); // Автоматическое удаление сгенерированных файлов

// Сервер
var browserSync = require('browser-sync').create();

/* --------------------------------------------------------
   ----------------- Таски ---------------------------
------------------------------------------------------------ */

// Поднимаем сервер
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    browserSync.watch('dist', browserSync.reload)
});

// Копирование файлов HTML в папку dist
gulp.task("html", function() {
    return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"));
});

// Копируем шрифты

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Объединение, компиляция Sass в CSS, простановка венд. префиксов и дальнейшая минимизация кода
gulp.task("sass", function() {
    return gulp.src("src/sass/**/*.sass")
        .pipe(concat('main.sass'))
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
         }))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css"));
});

// Объединение и сжатие JS-файлов
gulp.task("scripts", function() {
    return gulp.src("src/js/*.js") // директория откуда брать исходники
        .pipe(concat('scripts.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});

// Сжимаем картинки
gulp.task('imgs', function() {
    return gulp.src("src/img/**/*.+(png|jpg|jpeg|gif|svg)")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            interlaced: true
        }))
        .pipe(gulp.dest("dist/img"))
});

// Удаляем сгенерированные фаилы
gulp.task('clean', function() {
  del('dist');
})

// Задача слежения за измененными файлами
gulp.task("watch", function() {
    gulp.watch("src/*.html", ["html"]);
    gulp.watch("src/fonts/**/*", ["fonts"]);
    gulp.watch("src/js/*.js", ["scripts"]);
    gulp.watch("src/sass/**/*.sass", ["sass"]);
    gulp.watch("src/img/**/*.+(png|jpg|jpeg|gif|svg)", ["imgs"]);
});

///// Таски ///////////////////////////////////////

// Запуск тасков по умолчанию
gulp.task("default", [
  "server",
  "html",
  "fonts",
  "sass",
  "scripts",
  "imgs",
  "watch"
]);