import Dispatcher from "../dispatcher/dispatcher.js";

export const actionPost = {
    setState(str) {
        Dispatcher.dispatch({
            actionName: 'set',
            text: str,
        });
    },
    getState() {
        Dispatcher.dispatch({
            actionName: 'get',
        });
    },
};
