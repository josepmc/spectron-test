import { given, binding } from 'cucumber-tsflow';
import { BaseTest } from 'tests/helpers/base';
import { AccountSelector } from 'tests/objects/features/mainPage/accountSelector';
import { User } from '../authentication/userManager';

@binding()
class ExchangeQuote extends BaseTest {
    @given(/the user inputs a quote with '(.*)' from Account '(.*)'/)
    public async inputOptions(amount: string, account: string) {
        const user = User.GetUser(account);
        const selectors = {
            quoteInChat: './/button[contains(@class,"primary") and text()="Quote"][last()]',
            modalLoaded: './/*[contains(@class,"modal-content")]',
            mark: './/*[contains(@class,"modal-content")]//span[preceding-sibling::span[text()="Mark"]]',
            inputSell: './/*[contains(@class,"modal-content")]//*[contains(@class,"inputs-wrapper")]/input[1]',
            inputBuy: './/*[contains(@class,"modal-content")]//*[contains(@class,"inputs-wrapper")]/input[2]',
        };
        await this.client.waitForExist(selectors.quoteInChat).click(selectors.quoteInChat);
        await this.client.waitForExist(selectors.modalLoaded);
        await new AccountSelector().selectAccount(user.profileId);
        const markPrice = (await this.client.getText(selectors.mark)).replace(',', '');
        await this.client.setValue(selectors.inputSell, markPrice);
        await this.client.setValue(selectors.inputBuy, markPrice);
    }
    @given(/the user submits the quote/)
    public async sendQuote() {
        // Same as sendRFQ
        const selectors = {
            sendQuote: './/*[contains(@class,"modal-content")]//button[contains(@class,"primary-button")]',
        };
        // Reason this work is because we're using Chrome 74 vs Electron that's based on Chrome 69
        await this.client.click(selectors.sendQuote);
        await this.client.waitForExist('.//body[not(.//*[contains(@class,"modal-content")])]');
    }
}

export = ExchangeQuote;
