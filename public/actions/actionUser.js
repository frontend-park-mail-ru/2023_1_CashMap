import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с пользователем 
 */
export const actionUser = {
    /**
     * action для входа пользователя в систему
     * @param {*} data - данные пользователя
     */
    signIn(data) {
        Dispatcher.dispatch({
            actionName: 'signIn',
            data: data,
        });
    },
    /**
     * action для резистрации пользователя в системе
     * @param {*} data - данные пользователя
     */
    signUp(data) {
        Dispatcher.dispatch({
            actionName: 'signUp',
            data: data,
        });
    },
    /**
     * action для выхода пользователя из системы
     */
    signOut() {
        Dispatcher.dispatch({
            actionName: 'signOut',
        });
    },
    /**
     * action для получения информации о пользователе
     * @param {*} link - ссылка на пользователя
     */
    getProfile(callback, link) {
        Dispatcher.dispatch({
            actionName: 'getProfile',
            callback,
            link,
        });
    },
    /**
     * action для проверки авторизации пользователя
     */
    checkAuth(callback) {
        Dispatcher.dispatch({
            actionName: 'checkAuth',
            callback,
        });
    },
    /**
     * action для редактирования пользователя в системе
     * @param {*} data - данные пользователя
     */
    editProfile(data) {
        Dispatcher.dispatch({
            actionName: 'editProfile',
            data: data,
        });
    },
};
