import { binding, given } from 'cucumber-tsflow/dist';
import { BaseTest, BrowserSelection } from 'tests/helpers/base';

@binding()
class SharedSteps extends BaseTest {
    @given(/the User sets the browser control to (.*)/)
    public async setBrowserControl(browser: BrowserSelection) {
        this.setClient(browser);
        switch (browser) {
            case BrowserSelection.Browser:
                await this.client.window((await this.client.windowHandle()).value);
                break;
            case BrowserSelection.App:
                await this.internalApp.browserWindow.show();
                break;
            default:
                throw new Error(`Core: Focus for ${browser} not implemented`);
        }
    }
}

export = SharedSteps;
