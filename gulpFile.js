const gulp = require('gulp');
const { argv } = require('yargs');
const cucumber = require('gulp-cucumber');
const { resolve } = require('path');
const { removeSync, mkdirpSync } = require('fs-extra');
require('./register');

const reportDir = process.env.REPORT_DIR || (process.env.REPORT_DIR = resolve(__dirname, 'reports'));
removeSync(reportDir);
mkdirpSync(reportDir);

gulp.task('test', () => {
    return gulp.src(process.env.STEPS || argv.steps || 'tests/**/*.feature').pipe(
        cucumber({
            steps: ['./tests/**/*.ts'],
            format: [
                require.resolve('cucumber-pretty'),
                `${require.resolve('cucumber-junit-formatter')}:${
                    process.env.OUTPUT || argv.output || resolve(reportDir, 'output.json')
                }`,
            ],
            support: [],
            compiler: './register.js',
            runOptions: ['"--format-options={\\"colorsEnabled\\":true}"'],
        }),
    );
});
