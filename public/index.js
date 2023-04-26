import Router from "./modules/router.js";
import SignInView from "./views/signInView.js";
import SignUpView from "./views/signUpView.js";
import FeedView from "./views/feedView.js";
import FriendsView from "./views/friendsView.js";
import ProfileView from "./views/profileView.js";
import {actionUser} from "./actions/actionUser.js";
import EditPostView from "./views/editPostView.js";
import CreatePostView from "./views/createPostView.js";
import SettingsView from "./views/settingsView.js";
import SafetyView from "./views/safetyView.js";
import MessagesView from "./views/messagesView.js";
import ChatView from "./views/chatView.js";
import NotFoundView from "./views/notFoundView.js";
import imgStore from "./stores/imgStore.js"; /* НЕ УДАЛЯТЬ!!! */


const Views = {
    FeedView: new FeedView(),
    SignInView: new SignInView(),
    SignUpView: new SignUpView(),
    FriendsView: new FriendsView(),
    ProfileView: new ProfileView(),
    EditPostView: new EditPostView(),
    CreatePostView: new CreatePostView(),
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
Router.registerPage('/subscribers', Views.FriendsView);
Router.registerPage('/subscriptions', Views.FriendsView);
Router.registerPage('/findFriends', Views.FriendsView);
Router.registerPage('/myPage', Views.ProfileView);
Router.registerPage('/user', Views.ProfileView);
Router.registerPage('/editPost', Views.EditPostView);
Router.registerPage('/createPost', Views.CreatePostView);
Router.registerPage('/settings', Views.SettingsView);
Router.registerPage('/safety', Views.SafetyView);
Router.registerPage('/message', Views.MessagesView);
Router.registerPage('/chat', Views.ChatView);
Router.registerPage('/404', Views.NotFoundView);

actionUser.checkAuth(() => { Router.init() });
