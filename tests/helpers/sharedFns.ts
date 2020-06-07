import { Client } from 'webdriverio';
export function threadSleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export abstract class SharedFns {
    protected abstract get client(): Client<void>;
    public sleep(ms: number) {
        return threadSleep(ms);
    }
    /**
     * This function queries the DOM element for an attribute
     * @param selector A CSS Selector
     * @param attribute Any attribute from the element
     */
    public async getAttribute(selector: string, attribute: string): Promise<string> {
        // GetAttribute is not working in older versions of WebdriverIO :/
        //return await this.client.$(selector).getAttribute(attribute);
        return (
            await this.client.waitForExist(selector).execute(
                (selector, attribute) => {
                    return document.querySelector(selector).attributes[attribute].value;
                },
                selector,
                attribute,
            )
        ).value;
    }
    /**
     * This function scrolls to a specific element
     * @param selector A CSS Selector
     */
    public scrollTo(selector: string): Client<void> {
        return this.client
            .execute(
                (selector) =>
                    document
                        .querySelector(selector)
                        .scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }),
                selector,
            )
            .then(() => this.client);
    }
    /**
     * This function forces a click through Javascript
     * @param selector A CSS Selector
     */
    public async clickJS(selector: string): Promise<void> {
        await this.client.execute((selector) => {
            var event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false,
            });
            var cb = document.querySelector(selector);
            var canceled = !cb.dispatchEvent(event);
            if (canceled) {
                // preventDefault was called and the event cancelled
                return false;
            } else {
                return true;
            }
        }, selector);
    }
    /**
     * Dumps the body of the page
     */
    public async dumpHtml() {
        const html = await this.client.execute(() => {
            return document.querySelector('body').innerHTML;
        });
        console.log(html);
    }
}
