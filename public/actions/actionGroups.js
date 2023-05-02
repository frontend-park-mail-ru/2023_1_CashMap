import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с группами
 */
export const actionGroups = {
    /**
     * action для получения списка групп по ссылке пользователя
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getGroups(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getGroups',
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, созданных пользователем
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getmanageGroups(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getManageGroups',
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, на которые не подписан пользователь
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getNotGroups(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getNotGroups',
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
    getGroupInfo(callback, link) {
        Dispatcher.dispatch({
            actionName: 'getGroupInfo',
            callback,
            link,
        });
    },
    /**
     * action, который используется, чтобы создать группу
     * @param {*} data - данные группы
     */
    createGroup(data) {
        Dispatcher.dispatch({
            actionName: 'createGroup',
            data,
        });
    },
    /**
     * action для редактирования группы в системе
     * @param {*} data - данные группы
     */
    editGroup(data) {
        Dispatcher.dispatch({
            actionName: 'editGroup',
            data,
        });
    },
    /**
     * action для удвления группы
     * @param {*} data - данные группы
     */
    deleteGroup(data) {
        Dispatcher.dispatch({
            actionName: 'deleteGroup',
            data,
        });
    },
};
