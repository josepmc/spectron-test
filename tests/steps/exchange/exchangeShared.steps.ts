import { given, binding } from 'cucumber-tsflow';
import { BaseTest } from 'tests/helpers/base';
import { User } from '../authentication/userManager';
import { MainPage } from 'tests/objects/pages/mainPage/mainPage';
import { SideSelection } from 'tests/objects/features/mainPage/sidebar';
import { expect } from 'chai';

@binding()
class ExchangeShared extends BaseTest {
    @given(/the user selects the trade channel with '(.*)'/)
    public async selectTradeChannel(alias: string) {
        const user = User.GetUser(alias);
        const page = new MainPage();
        await page.sidebar.navigate(SideSelection.Chat);
        const content = await page.chat.selectChat(user.profileId);
        expect(await content.userId).to.be.equal(user.profileId, "Loaded chat isn't matching");
    }
}

export = ExchangeShared;
