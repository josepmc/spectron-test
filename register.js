const { resolve } = require('path');
const { readFileSync, existsSync } = require('fs');
const dotenv = require('dotenv');
if (existsSync('.env')) dotenv.config('.env');

process.env.TS_NODE_TRANSPILE_ONLY = true;
require('app-module-path').addPath(__dirname);
const config = JSON.parse(readFileSync(resolve(__dirname, 'tsconfig.json'), 'utf-8'));
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: config.compilerOptions,
});
require('tsconfig-paths').register({
    baseUrl: config.compilerOptions.baseUrl,
    paths: config.compilerOptions.paths,
});
