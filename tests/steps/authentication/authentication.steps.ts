import { given, binding } from 'cucumber-tsflow';
import { BaseTest } from 'tests/helpers/base';
import { User } from './userManager';
import { AuthenticationPage } from 'tests/objects/pages/authentication/auth';

@binding()
class Authentication extends BaseTest {
    @given(/the user navigates to the service/)
    public async navigateToService() {
        await new AuthenticationPage().navigate();
    }
    @given(/the user logs in as '(.*)'/)
    public async userLogin(alias: string) {
        const user = User.GetUser(alias);
        await new AuthenticationPage().login(user);
    }
}

export = Authentication;
