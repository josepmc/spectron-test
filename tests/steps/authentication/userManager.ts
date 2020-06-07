import { assert } from 'chai';

interface UserInterface {
    email: string;
    password: string;
    // inApp profile id
    profileId: string;
}

interface UserList {
    [k: string]: UserInterface;
}

export class User implements UserInterface {
    public email: string;
    public password: string;
    public profileId: string;
    public alias: string;
    private constructor(_user: UserInterface, _alias: string) {
        this.email = _user.email;
        this.password = _user.password;
        this.profileId = _user.profileId;
        this.alias = _alias;
    }
    public static GetUser(alias: string): User {
        const credentials = process.env.USER_LIST;
        assert(credentials, 'Test: No users are present, please define them in .env');
        const users: UserList = JSON.parse(credentials);
        const foundUser = users[alias];
        assert(foundUser, `User ${alias} could not be found`);
        return new User(foundUser, alias);
    }
}
