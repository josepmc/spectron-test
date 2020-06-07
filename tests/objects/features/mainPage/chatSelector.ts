import { Feature } from 'tests/objects/feature';
import { Item } from 'tests/objects/item';
import { Client } from 'webdriverio';
import { ChatContent } from './chatContent';

export class ChatItem extends Item {
    public static selector: string = './/*[@class="room-item"]';
    public get title(): string {
        return this.client
            .elementIdElement(this.element.ELEMENT, './/*[contains(@class, "room-item__body__title")]')
            .getText();
    }
    public get subtitle(): string {
        return this.client
            .elementIdElement(this.element.ELEMENT, './/*[contains(@class, "room-item__body__message")]')
            .getText();
    }
    public get user(): Client<string> {
        return this.client
            .elementIdElement(this.element.ELEMENT, './/*[contains(@class, "room-item__body__title")]/span')
            .getText()
            .then((t) => t.slice(1, t.length - 1));
    }
    public select() {
        return this.client.elementIdClick(this.element.ELEMENT);
    }
}

export class ChatSelector extends Feature {
    public async selectChat(user: string): Promise<ChatContent> {
        const chats = await ChatItem.GetAllItems(ChatItem);
        for (let chat of chats) {
            if ((await chat.user) === user) {
                await chat.select();
                await this.client.waitForExist(ChatContent.selector);
                return new ChatContent();
            }
        }
        throw new Error(`Couldn't find a chat for user ${user}`);
    }
}
