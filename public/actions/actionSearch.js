import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с пользователем
 */
export const actionSearch = {
    search(text) {
        Dispatcher.dispatch({
            actionName: 'userSearch',
            searchText: text,
            count: 10,
            offset: 0,
        });
    },

    searchForDropdown(text) {
        Dispatcher.dispatch({
            actionName: 'userSearch',
            searchText: text,
            count: 3,
            offset: 0,
        });
    },

    friendSearchForDropdown(link) {
        Dispatcher.dispatch({
            actionName: 'friendsSearch',
            link: link,
            count: 3,
            offset: 0
        });
    }
};
