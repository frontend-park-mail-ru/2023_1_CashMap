import Dispatcher from "../dispatcher/dispatcher.js";

export const actionFriends = {
    getFriends(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getFriends',
            link,
            count,
            offset,
        });
    },
    getSubscriptions(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getSub',
            type: 'out',
            link,
            count,
            offset,
        });
    },
    getSubscribers(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getSub',
            type: 'in',
            link,
            count,
            offset,
        });
    },
    sub(link) {
        Dispatcher.dispatch({
            actionName: 'sub',
            link,
        });
    },
    unsub(link) {
        Dispatcher.dispatch({
            actionName: 'unsub',
            link,
        });
    },
    reject(link) {
        Dispatcher.dispatch({
            actionName: 'reject',
            link,
        });
    },
};
