import { Feature } from '../../feature';
import assert = require('assert');

export enum SideSelection {
    Chat = 'Chat',
    Blotter = 'Blotter',
}

export class Sidebar extends Feature {
    private selectors: { [k in SideSelection]: { page: string; sidebar: string } } = {
        Chat: {
            page: './/*[@class="options-table"]',
            // In electron, relative links always start with hash #
            sidebar: 'a[href*="/main/"]',
        },
        Blotter: {
            page: './/*[contains(@class,"switcher-item")]',
            sidebar: 'a[href*="/blotter"]',
        },
    };
    public async navigate(type: SideSelection) {
        if (type === (await this.current())) return;
        const item = this.selectors[type];
        assert(item, `Type ${type} is still not implemented`);
        await this.client.$(item.sidebar).click();
        await this.client.$(item.page).waitForExist();
    }
    public async current(): Promise<SideSelection> {
        for (let [idx, { sidebar }] of Object.entries(this.selectors)) {
            const attr = await this.getAttribute(sidebar, 'class');
            if (attr.indexOf('active') != -1) return idx as SideSelection;
        }
        throw new Error('No element is currently selected');
    }
}
