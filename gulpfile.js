var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var plumber = require("gulp-plumber");
var autoprefixer = require("gulp-autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var posthtml = require("gulp-posthtml"); 
var include = require("posthtml-include");
var rename = require("gulp-rename"); 
var svgstore = require("gulp-svgstore");
var imagemin = require("gulp-imagemin");
var	browserSync = require('browser-sync');
var run = require("run-sequence");
var paths = {
  less:['project/less/style.less'],
  html:['project/*.html']
};

/////////////////////////////////////////////////////////////////////////////////
//изз лесс в цсс и минимизирует цсс файл
/////////////////////////////////////////////////////////////////////////////////
/*gulp.task("style", function () { 
	return gulp.src("project/less/main.less") 
	.pipe(plumber()) 
	.pipe(less())
	.pipe(autoprefixer({
			browsers: ['last 4 versions']
		})) 
	.pipe(gulp.dest("project/build/css/")) 
	.pipe(minify())
	.pipe(rename("main.min.css")) 
	.pipe(gulp.dest("project/build/css/")); 
});*/
var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');

gulp.task("style", function () { 
	return gulp.src("project/scss/style.scss") 
	.pipe(plumber()) 
	.pipe(sass())
	.pipe(autoprefixer({
			browsers: ['last 4 versions']
		})) 
	.pipe(gulp.dest("project/build/css/")) 
	.pipe(minify())
	.pipe(rename("style.min.css")) 
	.pipe(gulp.dest("project/build/css/")); 
});
//////////////////////////////////////////////////////////////////////////////////
// сжимает изображения
//////////////////////////////////////////////////////////////////////////////////
gulp.task("compress-jpg", function () {
	return gulp.src("project/img/**/*.jpg") 
		.pipe(imagemin([
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest("project/img/"));
	});
//////////////////////////////////////////////////////////////////////////////////
gulp.task("compress-png", function () {
	return gulp.src("project/img/**/*.png") 
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3})
		]))
		.pipe(gulp.dest("project/img/"));
	});
//////////////////////////////////////////////////////////////////////////////////
gulp.task("compress-svg", function () {
	return gulp.src("project/img/**/*.svg") 
		.pipe(imagemin([
			imagemin.svgo() 
		]))
		.pipe(gulp.dest("project/img/"));
	});
/////////////////////////////////////////////////////////////////////////////////
// svg спрайты
/////////////////////////////////////////////////////////////////////////////////
gulp.task("sprite", function () { 
	return gulp.src("project/img/icon-*.svg")
	.pipe(svgstore({ 
		inlineSvg: true 
	}))
	.pipe(rename("sprite.svg"))
	.pipe(gulp.dest("project/img/"));
});

				// webp не работает на вин7, нужен вин10
				//var gulp = require("gulp"); 
				//var webp = require("gulp-webp");

				//gulp.task("webp", function () { 
				//	return gulp.src("project/img/**/*.{png,jpg}") 
				//	.pipe(webp({quality: 90}))
				//	.pipe(gulp.dest("project/build/img/"));
				//});

/////////////////////////////////////////////////////////////////////////////////
//пост html -вставляет в разметку вместо инклюдов свг или что там заинклюжено
/////////////////////////////////////////////////////////////////////////////////
gulp.task("html", function () { 
	return gulp.src("project/*.html")
	.pipe(posthtml([ 
		include() 
		]))
	.pipe(gulp.dest("project/build/"));
});
/////////////////////////////////////////////////////////////////////////////////
//копирование файлов из продакшн в билд
/////////////////////////////////////////////////////////////////////////////////
gulp.task("copy", function () { 
	return gulp.src([ 
	"project/fonts/**/*.{woff,woff2}", 	
	"project/js/**/*.js",
	"project/img/**/*.*"
	], { 
		base: "project"
	}) 
	.pipe(gulp.dest("project/build/")); 
});
/////////////////////////////////////////////////////////////////////////////////
//отчистка папки build
/////////////////////////////////////////////////////////////////////////////////
 gulp.task("clean", function () { 
	return del("project/build");
});
/////////////////////////////////////////////////////////////////////////////////
//автопрефиксер
/////////////////////////////////////////////////////////////////////////////////
gulp.task('autoprefixer', function(){
	gulp.src('project/css/main.css')
	.pipe(autoprefixer({
		browsers: ['last 4 versions']
	}))
	.pipe(gulp.dest('project/build/css/'));
});

/////////////////////////////////////////////////////////////////////////////////
// запускаем все функции для сборки билда
/////////////////////////////////////////////////////////////////////////////////

gulp.task("build", function (done) { 
	run( 
		"clean",
		"copy", 
		"style",
		"compress-png",
		"compress-jpg",
		"compress-svg",
		"sprite", 
		"html",
		"autoprefixer",
		"reload",
		done
		 ); 
});


/////////////////////////////////////////////////////////////////////////////////
// сервер
/////////////////////////////////////////////////////////////////////////////////

gulp.task('sync', function() {
  browserSync.init({
    server: {
      baseDir: 'project/build/'
    }
  }) 
});

/////////////////////////////////////////////////////////////////////////////////
// следильщик
/////////////////////////////////////////////////////////////////////////////////
  gulp.task('watcher',function(){
    gulp.watch(paths.scss, ['build']);
    gulp.watch(paths.html, ['build']);
});

/////////////////////////////////////////////////////////////////////////////////
// перезагрузка сервера, не обновляет страницу, что то нужно сделать с ним(если нужно)
/////////////////////////////////////////////////////////////////////////////////
 gulp.task('reload', function() {
 	browserSync.reload
 });
