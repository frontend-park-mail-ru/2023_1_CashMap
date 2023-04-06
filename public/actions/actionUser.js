import Dispatcher from "../dispatcher/dispatcher.js";

export const actionUser = {
    signIn(data) {
        Dispatcher.dispatch({
            actionName: 'signIn',
            data: data,
        });
    },
    signUp(data) {
        Dispatcher.dispatch({
            actionName: 'signUp',
            data: data,
        });
    },
    signOut() {
        Dispatcher.dispatch({
            actionName: 'signOut',
        });
    },
    getUserInfo(link) {
        Dispatcher.dispatch({
            actionName: 'getUserInfo',
            link: link,
        });
    },
    checkAuth() {
        Dispatcher.dispatch({
            actionName: 'checkAuth',
        });
    },
};
