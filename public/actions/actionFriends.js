import Dispatcher from "../dispatcher/dispatcher.js";

export const actionFriends = {
    getFriends(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getFriends',
            friendsCount: count,
            friendsOffset: offset,
        });
    },
    createSub(data) {
        Dispatcher.dispatch({
            actionName: 'createSub',
        });
    },
};
