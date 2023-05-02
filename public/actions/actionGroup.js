import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с группой
 */
export const actionGroup = {
    /**
     * action для получения информации о группе
     * @param {*} link - ссылка на группу
     */
    getGroup(callback, link) {
        Dispatcher.dispatch({
            actionName: 'getGroup',
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
            data: data,
        });
    },
    /**
     * action для редактирования группы в системе
     * @param {*} data - данные группы
     */
    editgroup(data) {
        Dispatcher.dispatch({
            actionName: 'editgroup',
            data: data,
        });
    },
};
