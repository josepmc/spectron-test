import { binding, before, after } from 'cucumber-tsflow';
import { BaseTest } from './base';
import { setDefaultTimeout, BeforeAll, AfterAll } from 'cucumber';
import { Application } from 'spectron';
import * as webdriver from 'webdriverio';
import { resolve } from 'path';
import { assert } from 'chai';
import { executablePath } from 'puppeteer';
import { threadSleep } from './sharedFns';
setDefaultTimeout(5 * 60 * 1000);
const service = require('wdio-chromedriver-service/launcher');
const getPort = require('get-port');
const verbose = (process.env.NODE_DEBUG || '').indexOf('test') != -1;
const waitforTimeout = 2 * 60 * 1000;

interface WDOptions extends WebdriverIO.Options {
    // Not documented on the typings
    logOutput: string;
}

let port = 9000;
BeforeAll(async () => {
    try {
        port = await getPort(port);
        // Version 4 is not registering the services when running on standalone
        const chromeDriverOpts = {
            chromeDriverArgs: [
                `--port=${port}`,
                `--log-path=${resolve(process.env.REPORT_DIR, 'browser-chromedriver.log')}`,
            ],
            // These logs are not useful
            chromeDriverLogs: undefined, //relative(process.cwd(), process.env.REPORT_DIR),
            // this value is ignored
            logToStdout: true,
        };
        if (verbose) chromeDriverOpts.chromeDriverArgs.push('--verbose');
        await service.onPrepare(chromeDriverOpts);
        // wait some time for the service to be up
        await threadSleep(1000);
    } catch (error) {
        console.error(`Core: A critical error ocurrred while starting chromedriver, aborting.\n${error.message}`);
        process.exit(1);
    }
});

AfterAll(async () => {
    try {
        await service.onComplete();
    } catch (error) {}
});

@binding()
class Setup extends BaseTest {
    @before()
    public reset() {
        this.client = this.internalApp = this.internalBrowser = null;
    }
    @before()
    public async setupBrowser() {
        const maxAttempts = 10;
        for (let i = 0; i < maxAttempts; ++i) {
            try {
                console.log(`Trying to start browser: ${i + 1}/${maxAttempts}`);
                const extraArgs = process.env.HEADLESS ? ['--headless'] : [];
                // Change this for other browsers if desired
                const options: WDOptions = {
                    // if electron gets updated to a newer version that uses wdio 5.x,
                    // we can use the following and avoid all this trouble
                    //automationProtocol: 'devtools', //WDIO v5 or later
                    //outputDir: process.env.REPORT_DIR, //WDIO v5 or later
                    logOutput: process.env.REPORT_DIR,
                    waitforTimeout: waitforTimeout,
                    port: port,
                    path: '/',
                    desiredCapabilities: {
                        browserName: 'chrome',
                        chromeOptions: {
                            binary: executablePath(),
                            // setSize doesn't always work, this is the best workaround
                            args: ['--start-fullscreen', '--disable-dev-shm-usage'].concat(extraArgs),
                        },
                    },
                };
                if (verbose) options.logLevel = 'verbose';
                const browser = webdriver.remote(options);
                await browser.init();
                this.internalBrowser = browser;
                return;
            } catch (error) {
                console.error(`Error while starting browser: ${error}`);
                await service.onComplete();
            }
            throw new Error("Core: Couldn't start the browser");
        }
    }
    @before()
    public async setupApp() {
        const maxAttempts = 10;
        const appPath = process.env.APP_PATH;
        assert(!!appPath, 'Core: App is not present');
        for (let i = 0; i < maxAttempts; ++i) {
            try {
                console.log(`Trying to start app: ${i + 1}/${maxAttempts}`);
                const app = new Application({
                    path: appPath,
                    chromeDriverLogPath: resolve(process.env.REPORT_DIR, 'app-chromedriver.log'),
                    waitTimeout: waitforTimeout,
                    startTimeout: waitforTimeout,
                });
                this.internalApp = await app.start();
                await this.internalApp.browserWindow.maximize();
                await this.internalApp.browserWindow.setSize(1680, 1050);
                return;
            } catch (error) {
                console.error(`Error while starting app: ${error}`);
            }
        }
        throw new Error("Core: Couldn't start the app");
    }
    @after()
    public async tearDown() {
        try {
            await this.internalApp.stop();
        } catch (error) {}
        try {
            // WDIO v4 will close the browser like this, but reject the promise
            await this.internalBrowser.close();
        } catch (error) {}
    }
}

export = Setup;
