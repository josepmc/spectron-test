import { binding, given } from 'cucumber-tsflow/dist';
import { BaseTest, BrowserSelection } from 'tests/helpers/base';

@binding()
class SharedSteps extends BaseTest {
    @given(/the User sets the browser control to (.*)/)
    public async setBrowserControl(browser: BrowserSelection) {
        await this.setClient(browser);
    }
}

export = SharedSteps;
