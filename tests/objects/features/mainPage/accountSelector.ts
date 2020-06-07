import { Feature } from 'tests/objects/feature';

export class AccountSelector extends Feature {
    public async selectAccount(account: string): Promise<void> {
        const selectors = {
            account: './/*[@id="select-account"]',
            accountsVisible: './/*[@role="option"]',
            accountSelection: `.//*[@role="option" and ./*[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')="${account.toLowerCase()}"]]`,
        };
        await this.client.waitForVisible(selectors.account).click(selectors.account);
        await this.client.waitForVisible(selectors.accountsVisible).click(selectors.accountSelection);
    }
}
