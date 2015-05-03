'use strict'

var autoprefixer = require( 'autoprefixer-core' ),
    del = require( 'del' ),
    gulp = require( 'gulp' ),
    concat = require( 'gulp-concat' ),
    connect = require( 'gulp-connect' ),
    livereload = require( 'gulp-livereload' ),
    minify = require( 'gulp-minify-css' ),
    postcss = require( 'gulp-postcss' ),
    sass = require( 'gulp-sass' ),
    uglify = require( 'gulp-uglify' );

var css_paths = [
	'./node_modules/normalize.css/normalize.css',
	'./assets/scss/*.scss'
];

gulp.task( 'clean', function( cb ) {
	del( [ './app/all.min.css', './app/all.min.js' ], cb );
});

gulp.task( 'connect', function() {
	connect.server({
		root: 'app',
		livereload: true
	});
});

gulp.task( 'html', function () {
	gulp.src( './app/*.html' )
	.pipe( connect.reload() );
});

gulp.task( 'sass', function() {
	return gulp.src( css_paths )
    .pipe( concat( 'all.min.css' ) )
    .pipe( sass() )
    .pipe( gulp.dest( 'app' ) )
	.pipe( connect.reload() );
});

gulp.task( 'styles', function() {
	var processors = [ autoprefixer( { browsers: [ '> 1%' ] } ) ];
	return gulp.src( css_paths )
    .pipe( concat( 'all.min.css' ) )
    .pipe( sass() )
	.pipe( postcss( processors ) )
	.pipe( minify() )
	.pipe( gulp.dest( './app/' ) );
});

gulp.task( 'scripts', function() {
	return gulp.src( './assets/js/*.js' )
	.pipe( concat( 'all.min.js' ) )
	.pipe( uglify() )
	.pipe( gulp.dest( './app/' ) );
});

gulp.task( 'watch', [ 'connect' ], function () {
	gulp.watch( [ './app/*.html', './assets/scss/*.scss', './assets/js/*.js' ], [ 'html', 'sass' ] );
});

gulp.task( 'default', [ 'clean', 'scripts', 'styles' ] );
