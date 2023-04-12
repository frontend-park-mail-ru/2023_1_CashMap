import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с друзьями 
 */
export const actionFriends = {
    /**
     * action для получения списка друзей по ссылке пользователя
     */

    /**
     * action для получения списка друзей по ссылке пользователя
     * @param {*} link - ссылка пользователя
     * @param {} count - количество возвращаемых друзей
     * @param {*} offset - смещение
     */
    getFriends(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getFriends',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения списка всех пользователей
     * @param {*} count - количество возвращаемых пользователей
     * @param {*} offset - смещение
     */
    getUsers(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getUsers',
            count,
            offset,
        });
    },
    /**
     * action для получения списка пользователей, которые не являются друзьями
     * @param {*} count - количество возвращаемых пользователей
     * @param {*} offset - смещение
     */
    getNotFriends(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getNotFriends',
            count,
            offset,
        });
    },
    /**
     * action для получения подписок пользователя
     * @param {*} link - ссылка на пользователя
     * @param {*} count - количество аозвращаемых подписок
     * @param {*} offset - смещение
     */
    getSubscriptions(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getSub',
            type: 'out',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения подписчиков пользователя
     * @param {*} link - ссылка на пользователя
     * @param {*} count - количество аозвращаемых подписок
     * @param {*} offset - смещение
     */
    getSubscribers(link, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getSub',
            type: 'in',
            link,
            count,
            offset,
        });
    },
    /**
     * action, который используется, чтобы подписаться на пользователя
     * @param {*} link - ссылка на пользователя
     */
    sub(link) {
        Dispatcher.dispatch({
            actionName: 'sub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отписаться от пользователя
     * @param {*} link - ссылка на пользователя
     */
    unsub(link) {
        Dispatcher.dispatch({
            actionName: 'unsub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отклонить заявку
     * @param {*} link - ссылка на человека, которому отменяем заявку
     */
    reject(link) {
        Dispatcher.dispatch({
            actionName: 'reject',
            link,
        });
    },
};
