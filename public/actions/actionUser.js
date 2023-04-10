import Dispatcher from "../dispatcher/dispatcher.js";

export const actionUser = {
<<<<<<< HEAD
    setState(str) {
        Dispatcher.dispatch({
            actionName: 'set',
            text: str,
        });
    },
    getState() {
        Dispatcher.dispatch({
            actionName: 'get',
=======
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
    getProfile(callback, link) {
        Dispatcher.dispatch({
            actionName: 'getProfile',
            callback,
            link,
        });
    },
    checkAuth(callback) {
        Dispatcher.dispatch({
            actionName: 'checkAuth',
            callback,
        });
    },
    editProfile(data) {
        Dispatcher.dispatch({
            actionName: 'editProfile',
            data: data,
>>>>>>> main
        });
    },
};
