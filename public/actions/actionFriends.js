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
    createSub(data) {
        Dispatcher.dispatch({
            actionName: 'createSub',
        });
    },
};
