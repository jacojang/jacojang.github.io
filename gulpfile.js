var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var clean = require('gulp-clean');

var src_files = [
	'src/**/*',
];

gulp.task('clean', function () {
	return gulp.src('dist/*', {read: false})
		.pipe(clean());
});

gulp.task('src-copy',['clean'], function () {
	return gulp.src(src_files)
		.pipe(gulp.dest('dist'));
});

gulp.task('bootstrap-copy',['src-copy'], function() {
	return gulp.src('node_modules/bootstrap/dist/**/*')
		.pipe(gulp.dest('dist/bootstrap'));
});

gulp.task('jquery-copy',['bootstrap-copy'], function() {
	return gulp.src('node_modules/jquery/dist/**/*')
		.pipe(gulp.dest('dist/jquery'));
});

gulp.task('moment-copy',['jquery-copy'], function() {
	return gulp.src([
		'node_modules/moment/**/*'
	])
		.pipe(gulp.dest('dist/moment'));
});

gulp.task('default', ['moment-copy']);
