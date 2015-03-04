var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jest = require('gulp-jest');
var rename = require("gulp-rename");
var nodemon = require("gulp-nodemon");
var reactify = require('reactify');

var reactifyES6 = function(file) {
  return reactify(file, {'es6': true});
};

gulp.task('build', function () {
    return gulp.src('public-src/app.js')
        .pipe(browserify({
        	transform: [reactifyES6, 'envify'],
          	debug : true
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./public'))
        .on('error', function(err) {
            console.log(err, 'LOTS OF ERROS');
            throw err;
        });
});

gulp.task('test', function () {
	return gulp.src('./public-src')
		.pipe(jest({
            testPathDirs: "./public-src",
	        scriptPreprocessor: "../jest-preprocessor.js",
            unmockedModulePathPatterns: ["../node_modules/react"],
	    }))
        .on('error', function(err) {
            console.log(err, 'LOTS OF ERROS');
            throw err;
        });
});

// Watch
gulp.task('watch', function () {
    // Watch .js files
    return gulp.watch('./public-src/**/*', ['build'])
        .on('error', function(err) {
            console.log(err, 'LOTS OF ERROS');
            throw err;
        });

});

gulp.task('serve', function () {
    nodemon({ script: 'server.js', nodeArgs: ['--harmony'], watch: 'server.js' })
    .on('restart', function () {
        console.log('restarted!');
    });
});