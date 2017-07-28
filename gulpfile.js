var gulp = require("gulp");
var sass = require("gulp-sass");
var htmlmin  = require('gulp-htmlmin');
var notify  = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var del = require("del");

/*Após compilar antes de salvar ele deleta o arquivo atual/*
/* Task evit problems cache css */
gulp.task("cache:css", function(){
	del("./dist/css/style.css")
});

gulp.task("cache:js", function(){
	del("./dist/js/app.js")
});

/* tarefa compilar sass para css*/
gulp.task("sass", ['cache:css'], function(){
	return gulp.src("./src/sass/style.scss")
	/*compila e minifica scss */
	.pipe(sass({outputStyle: 'compressed'}))
	.on('error', notify.onError({title: "se fudeu", message: "<%= error.message %>"}))
	.pipe(gulp.dest("./dist/css"))
	.pipe(browserSync.stream());
});	

/* tarefa minifica o html*/
gulp.task("html", function(){
	return gulp.src("./src/*.html")
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
});

/* tarefa minifica js */
gulp.task("jsmin", ['cache:js'], function(){
	return gulp.src("./src/js/app.js")
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream())
});

/* tarefa juntar javascripts base */
gulp.task("concat", function(){
	return gulp.src ([
		'./src/components/jquery/dist/jquery.js',
		'./src/components/tether/dist/js/tether.js',
		'./src/components/bootstrap/dist/js/bootstrap.js'
		])
	.pipe(concat("main.js"))
	.pipe(uglify())
	.pipe(gulp.dest("./dist/js"))
});


/* tarefa mover fonts para font awesome */
gulp.task("move-fonts", function(){
	return gulp.src('./src/components/components-font-awesome/fonts/**')
	.pipe(gulp.dest("./dist/fonts"))
});


/* tarefa rodar servidor local */
gulp.task("server", function(){
	browserSync.init({
		server:{
			baseDir:"./dist"
		}
	});

	/* escutar arquivos dev */
	gulp.watch("./src/sass/**/*.scss", ['sass']);
	gulp.watch("./src/components/bootstrap/scss/**/*.scss", ['sass']);
	gulp.watch("./src/js/**/*.js", ["jsmin"]);
	gulp.watch("./src/*.html", ['html']);
});


/*defaul*/
gulp.task("default", ['sass', 'html', 'jsmin', 'concat', 'move-fonts', 'server'])




