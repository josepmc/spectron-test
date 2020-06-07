import { Feature } from '../../feature';
import { User } from 'tests/steps/authentication/userManager';
import assert = require('assert');

export class AuthenticationPage extends Feature {
    public selectors = {
        email: './/*[@id="email"]',
        password: './/*[@id="password"]',
        submit: './/button[@type="submit"]',
        signedIn: './/*[@class="sidebar"]',
    };
    public async navigate() {
        const url = process.env.URL;
        assert(!!url, 'Environment variable URL is not defined');
        await this.client.url(url);
        // The page does rerender after loading, it's a bug :/
        await this.client.waitForExist(this.selectors.email);
        const waitTime = 10000;
        console.warn(`Waiting ${waitTime / 1000} seconds for the page to reload itself...`);
        await this.sleep(waitTime);
        await this.client.waitForExist(this.selectors.email);
    }

    public async login(user: User) {
        await this.client.waitForExist(this.selectors.email);
        await this.client.$(this.selectors.email).setValue(user.email);
        await this.client.$(this.selectors.password).setValue(user.password);
        await this.client.$(this.selectors.submit).click();
        await this.client.waitForExist(this.selectors.signedIn);
    }
}
