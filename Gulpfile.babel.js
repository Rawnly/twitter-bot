const gulp = require('gulp');
const babel = require('gulp-babel');
const chalk = require('chalk');
const source = require('gulp-sourcemaps');
const del = require('del');

const date  = new Date();
const now = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

gulp.task('default', () => {
	const w = gulp.watch('src/**/*.js', ['clean', 'copy:json', 'build'])

	w.on('change', ({path}, stats) => {
		path = path.split('/').pop()
		if ( path.includes('.js') ) {
			console.log(chalk`[{gray ${now}}]  BUILDING: '{yellow ${path}}'`);			
		} else if ( path.includes('.css') || path.includes('.scss') || path.includes('.sass') ) {
			console.log(chalk`[{gray ${now}}]  BUILDING: '{red ${path}}'`);			
		}
	})
})

gulp.task('build', () => {
	gulp.src('src/**/*.js')
		.pipe(source.init())
		.pipe(babel())
		.pipe(source.write('.'))
		.pipe(gulp.dest('build'))
});

gulp.task('copy:json', () => {
	gulp.src('src/**/*.json')
		.pipe(gulp.dest('build'))
})

gulp.task('clean', () => {
	del(['build/**/*.js', 'build/**/*.json'], paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
	});
})

