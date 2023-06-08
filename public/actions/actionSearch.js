import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с пользователем
 */
export const actionSearch = {
    search(text, count=3, offset=0, isScroll=false) {
        Dispatcher.dispatch({
            actionName: 'userSearch',
            searchText: text,
            count: count,
            offset: offset,
            isScroll
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
