import { Feature } from 'tests/objects/feature';
import { Sidebar } from 'tests/objects/features/mainPage/sidebar';
import { ChatSelector } from 'tests/objects/features/mainPage/chatSelector';

export class MainPage extends Feature {
    public sidebar = new Sidebar();
    public chat = new ChatSelector();
}
