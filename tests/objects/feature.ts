import { BaseTest } from 'tests/helpers/base';
import { SharedFns } from 'tests/helpers/sharedFns';
import { Client } from 'webdriverio';

export abstract class Feature extends SharedFns {
    public get client(): Client<void> {
        return BaseTest.client;
    }
}
