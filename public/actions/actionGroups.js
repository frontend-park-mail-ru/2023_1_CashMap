import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с группами 
 */
export const actionGroups = {
    /**
     * action для получения списка групп по ссылке пользователя
     * @param {*} link - ссылка пользователя
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getGroups(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getGroups',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, созданных пользователем
     * @param {*} link - ссылка пользователя
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getUserGroups(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getUserGroups',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, на которые не подписан пользователь
     * @param {*} link - ссылка пользователя
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getNotGroups(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getNotGroups',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения списка популярных групп
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getPopularGroups(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getPopularGroups',
            count,
            offset,
        });
    },
    /**
     * action, который используется, чтобы подписаться на группу
     * @param {*} link - ссылка на группу
     */
    sub(link) {
        Dispatcher.dispatch({
            actionName: 'sub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отписаться от группы
     * @param {*} link - ссылка на группу
     */
    unsub(link) {
        Dispatcher.dispatch({
            actionName: 'unsub',
            link,
        });
    },
};
