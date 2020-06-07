import { Feature } from 'tests/objects/feature';
import { Client } from 'webdriverio';
import { assert } from 'chai';

export class ChatContent extends Feature {
    public static selector: string = './/span[preceding-sibling::*[@class="ml-2"]]';
    public get userId(): Client<string> {
        return this.client.getText('.//span[preceding-sibling::*[@class="ml-2"]]').then((v) => {
            const matching = /\((.*)\)/.exec(v);
            assert(matching);
            return matching[1];
        });
    }
}
