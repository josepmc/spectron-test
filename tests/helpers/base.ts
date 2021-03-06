import { Application } from 'spectron';
import { Client } from 'webdriverio';
import { SharedFns } from './sharedFns';

export enum BrowserSelection {
    App = 'App',
    Browser = 'Browser',
}

export class BaseTest extends SharedFns {
    private static _app: Application;
    protected get internalApp(): Application {
        return BaseTest._app;
    }
    protected set internalApp(instance: Application) {
        BaseTest._app = instance;
    }
    private static _browser: Client<void>;
    protected get internalBrowser(): Client<void> {
        return BaseTest._browser;
    }
    protected set internalBrowser(instance: Client<void>) {
        BaseTest._browser = instance;
    }
    // Tests should use the common client
    private static _client: Client<void>;
    public static get client(): Client<void> {
        return BaseTest._client || (BaseTest._client = BaseTest._app.client);
    }
    protected get client(): Client<void> {
        return BaseTest.client;
    }
    protected set client(instance: Client<void>) {
        BaseTest._client = instance;
    }
    protected async setClient(desired: BrowserSelection): Promise<void> {
        switch (desired) {
            case BrowserSelection.App:
                this.client = (this.internalApp.client as unknown) as Client<void>;
                await this.internalApp.browserWindow.show();
                break;
            case BrowserSelection.Browser:
                this.client = this.internalBrowser;
                await this.internalApp.browserWindow.hide();
                await this.client.window((await this.client.windowHandle()).value);
                break;
            default:
                throw new Error(`Core: Can't set control, unknown browser ${desired}`);
        }
    }
}
