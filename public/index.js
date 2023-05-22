import Router from "./modules/router.js";
import SignInView from "./views/signInView.js";
import SignUpView from "./views/signUpView.js";
import FeedView from "./views/feedView.js";
import FriendsView from "./views/friendsView.js";
import GroupsView from "./views/groupsView.js";
import GroupView from "./views/groupView.js";
import ProfileView from "./views/profileView.js";
import {actionUser} from "./actions/actionUser.js";
import SettingsGroupView from "./views/settingsGroupView.js";
import SettingsView from "./views/settingsView.js";
import SafetyView from "./views/safetyView.js";
import MessagesView from "./views/messagesView.js";
import ChatView from "./views/chatView.js";
import NotFoundView from "./views/notFoundView.js";
import imgStore from "./stores/imgStore.js"; /* НЕ УДАЛЯТЬ!!! */

/*import "./index.css"*/

/*if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}*/

const Views = {
    FeedView: new FeedView(),
    SignInView: new SignInView(),
    SignUpView: new SignUpView(),
    FriendsView: new FriendsView(),
    GroupsView: new GroupsView(),
    GroupView: new GroupView(),
    ProfileView: new ProfileView(),
    SettingsGroupView: new SettingsGroupView(),
    SettingsView: new SettingsView(),
    SafetyView: new SafetyView(),
    MessagesView: new MessagesView(),
    ChatView: new ChatView(),
    NotFoundView: new NotFoundView(),
};

Router.registerPage('/', Views.FeedView);
Router.registerPage('/feed', Views.FeedView);
Router.registerPage('/signIn', Views.SignInView);
Router.registerPage('/signUp', Views.SignUpView);
Router.registerPage('/friends', Views.FriendsView);
Router.registerPage('/groups', Views.GroupsView);
Router.registerPage('/subscribers', Views.FriendsView);
Router.registerPage('/subscriptions', Views.FriendsView);
Router.registerPage('/findFriends', Views.FriendsView);
Router.registerPage('/group', Views.GroupView);
Router.registerPage('/groups', Views.GroupsView);
Router.registerPage('/manageGroups', Views.GroupsView);
Router.registerPage('/findGroups', Views.GroupsView);
Router.registerPage('/popularGroups', Views.GroupsView);
Router.registerPage('/myPage', Views.ProfileView);
Router.registerPage('/user', Views.ProfileView);
Router.registerPage('/settingsGroup', Views.SettingsGroupView);
Router.registerPage('/settings', Views.SettingsView);
Router.registerPage('/safety', Views.SafetyView);
Router.registerPage('/message', Views.MessagesView);
Router.registerPage('/chat', Views.ChatView);
Router.registerPage('/404', Views.NotFoundView);

actionUser.checkAuth(() => { Router.init() });
