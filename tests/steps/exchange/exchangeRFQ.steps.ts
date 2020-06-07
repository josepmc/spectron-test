import { given, binding } from 'cucumber-tsflow';
import { BaseTest } from 'tests/helpers/base';
import { User } from '../authentication/userManager';
import { AccountSelector } from 'tests/objects/features/mainPage/accountSelector';

// This class should be using PO's should we work further on this PoC
@binding()
class ExchangeRFQ extends BaseTest {
    @given(/the user selects an RFQ with CF and Future and Account '(.*)'/)
    public async selectOptions(account: string) {
        // Wait for the chat content to be loaded
        const user = User.GetUser(account);
        const selectors = {
            chatLoaded: './/*[contains(@class, "trading-buttons")]',
            rfq: './/*[contains(@class, "trading-button") and text()="RFQ"]',
            modalLoaded: './/*[@class="modal-content"]',
            cf: './/*[contains(@class,"item") and text()="CF"]',
            future: './/*[contains(@class,"item") and text()="Future"]',
        };
        await this.client.waitForExist(selectors.chatLoaded);
        // The chat itself should be a PO
        await this.client.click(selectors.rfq); // RFQ
        // The modal should be another PO
        // Modal dialog will appear now
        await this.client.waitForExist(selectors.modalLoaded);
        await this.client.click(selectors.cf); //CF
        await this.sleep(1000); // slow computers may take some time
        await this.client.waitForEnabled(selectors.future).click(selectors.future); //Future
        // account is a dropdown
        await new AccountSelector().selectAccount(user.profileId);
    }
    @given(/the user selects '(.*)' and '(.*)' in the RFQ/)
    public async inputOptions(expiry: string, amount: string) {
        // The entire table should be a FO
        const selectors = {
            tableLoaded: './/tr[.//td[text()="BTC Future - DBT"]]',
            expiry: './/tr[.//td[text()="BTC Future - DBT"]]//*[text()="Select"]',
            expirySelection: `.//tr[.//td[text()="BTC Future - DBT"]]//*[text()="${expiry}"]`,
            amount: './/tr[.//td[text()="BTC Future - DBT"]]//*[text()="Enter"]',
            amountInput: './/tr[.//td[text()="BTC Future - DBT"]]//input[@inputmode="numeric"]',
        };
        await this.client.waitForVisible(selectors.tableLoaded);
        await this.client.click(selectors.expiry);
        await this.client.waitForVisible(selectors.expirySelection).click(selectors.expirySelection);
        await this.client.click(selectors.amount).setValue(selectors.amountInput, amount);
    }
    @given(/the user sends the RFQ/)
    public async sendRFQ() {
        // The page has a very bad scrollable hierarchy
        // No javascript will trigger this button.. This is a *horrible* solution and needs to be revised (will only occur in electron sadly)
        await this.client.keys(['Tab']);
        await this.sleep(1000);
        await this.client.keys(['Tab']);
        await this.sleep(1000);
        await this.client.keys(['Enter']);
        await this.client.waitForExist('.//body[not(.//*[@class="modal-content"])]');
    }
    @given(/the User executes the action '(.*)'/)
    public async executeAction(action: 'Buy' | 'Sell') {
        const selectors = {
            Buy: './/button[contains(@class,"primary-button") and text()="Buy"][last()]',
            Sell: './/button[contains(@class,"primary-button") and text()="Sell"][last()]',
            modalLoaded: './/*[contains(@class,"modal-content")]',
            BuyInModal:
                './/*[contains(@class,"modal-content")]//button[contains(@class,"primary-button") and text()="Buy"]',
            SellInModal:
                './/*[contains(@class,"modal-content")]//button[contains(@class,"primary-button") and text()="Sell"]',
        };
        await this.client.waitForExist(selectors[action]).click(selectors[action]);
        await this.client.waitForExist(selectors.modalLoaded);
        await this.sleep(2000); // slow windows computers will sometimes not render the element in time
        await this.client.click(selectors[`${action}InModal`]);
        await this.client.waitForExist('.//body[not(.//*[contains(@class,"modal-content")])]');
    }
}

export = ExchangeRFQ;
