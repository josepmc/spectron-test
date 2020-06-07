const gulp = require('gulp');
const { argv } = require('yargs');
const gulpCucumber = require('gulp-cucumber');
const { resolve } = require('path');
const { removeSync, mkdirpSync } = require('fs-extra');
require('./register');

const reportDir = process.env.REPORT_DIR || (process.env.REPORT_DIR = resolve(__dirname, 'reports'));
removeSync(reportDir);
mkdirpSync(reportDir);

function cucumber() {
    return gulp.src(process.env.STEPS || argv.steps || 'tests/**/*.feature').pipe(
        gulpCucumber({
            steps: ['./tests/**/*.ts'],
            format: [
                require.resolve('cucumber-pretty'),
                `${require.resolve('cucumber-junit-formatter')}:${
                    process.env.OUTPUT || argv.output || resolve(reportDir, 'output.xml')
                }`,
            ],
            support: [],
            compiler: './register.js',
            runOptions: ['--format-options', '{"colorsEnabled": true, "scenarioAsStep": true}'],
        }),
    );
}

function done(done) {
    done();
    process.exit(0);
}

exports.test = exports.default = gulp.series(cucumber, done);
