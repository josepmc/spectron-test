import { BaseTest } from 'tests/helpers/base';
import { Feature } from './feature';

type Constructor<T> = {
    new (element: WebdriverIO.Element): T;
    selector: string;
};
export class Item extends Feature {
    public constructor(public element: WebdriverIO.Element) {
        super();
    }
    public static async GetAllItems<T extends Item>(type: Constructor<T>): Promise<T[]> {
        const elements = await BaseTest.client.elements(type.selector);
        return elements.value.map((el) => new type(el));
    }
}
