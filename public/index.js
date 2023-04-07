import Router from "./modules/router.js";
import SignInView from "./views/signInView.js";
import SignUpView from "./views/signUpView.js";
import FeedView from "./views/feedView.js";
import FriendsView from "./views/friendsView.js";
import ProfileView from "./views/profileView.js";
import {actionUser} from "./actions/actionUser.js";
import {actionPost} from "./actions/actionPost.js";


const Views = {
    FeedView: new FeedView(),
    SignInView: new SignInView(),
    SignUpView: new SignUpView(),
    FriendsView: new FriendsView(),
    ProfileView: new ProfileView(),
};

/*actionUser.checkAuth();*/

Router.registerPage('/', Views.FeedView);
Router.registerPage('/feed', Views.FeedView);
Router.registerPage('/signIn', Views.SignInView);
Router.registerPage('/signUp', Views.SignUpView);
Router.registerPage('/friends', Views.FriendsView);
Router.registerPage('/profile', Views.ProfileView);

Router.init()

// actionPost.createPostUser(userStore.user.link, userStore.user.link, true, text);
/*for (let i = 0; i < 10; i++) {
    actionPost.createPostUser('id1', 'id1', true, 'text');
}*/

