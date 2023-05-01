import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {groupAvatarDefault} from "../static/htmlConst.js";
import userStore from "./userStore.js";
//import {actionGroups} from "../actions/actionGroups.js";

/**
 * класс, хранящий информацию о группах
 */
class groupsStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        this.groups = [];
        this.userGroups = [];
        this.findGroups = [];
        this.popularGroups = [];

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    /**
     * Метод, регистрирующий callback
     * @param {*} callback - callback
     */
    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    /**
     * Метод, реализующий обновление хранилища
     */
    _refreshStore() {
        this._callbacks.forEach((callback) => {
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Метод, реализующий реакцию на рассылку диспетчера
     * @param {action} action - действие, которое будет обработано
     */
    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'getGroups':
                await this._getGroups(action.link, action.count, action.offset);
                break;
            case 'getUserGroups':
                await this._getUserGroups(action.link, action.count, action.offset);
                break;
            case 'getNotGroups':
                await this._getNotGroups(action.link, action.count, action.offset);
                break;
            case 'getPopularGroups':
                await this._getPopularGroups(action.count, action.offset);
                break;
            case 'sub':
                await this._sub(action.link);
                break;
            case 'unsub':
                await this._unsub(action.link);
                break;
            case 'reject':
                await this._reject(action.link);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка групп
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getGroups(link, count, offset) {
        const request = await Ajax.getGroups(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isGroup = true;
                if (!group.avatar) {
                    group.avatar = groupAvatarDefault;
                }
            });

            this.groups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение групп, созданных пользователем
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getUserGroups(link, count, offset) {
        const request = await Ajax.getUserGroups(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isUserGroup = true;
                if (!group.avatar) {
                    group.avatar = groupAvatarDefault;
                }
            });

            this.userGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение групп, на которые не подписан пользователь
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getNotGroups(link, count, offset) {
        const request = await Ajax.getNotGroups(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isNotUserGroup = true;
                if (!group.avatar) {
                    group.avatar = groupAvatarDefault;
                }
            });

            this.findGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение популярных групп
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getPopularGroups(count, offset) {
        const request = await Ajax.getPopularGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isPopularGroup = true;
                if (!group.avatar) {
                    group.avatar = groupAvatarDefault;
                }
            });

            this.popularGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    // /**
    //  * Метод, реализующий реакцию на подписку
    //  * @param {String} link - ссылка на пользователя
    //  */
    // async _sub(link) {
    //     const request = await Ajax.sub(link);

    //     if (request.status === 200) {
    //         actionFriends.getFriends(userStore.user.user_link, 15, 0);
    //         actionFriends.getNotFriends(15, 0);
    //         actionFriends.getSubscribers(userStore.user.user_link, 15);
    //         actionFriends.getSubscriptions(userStore.user.user_link, 15);
    //     } else if (request.status === 401) {
    //         actionUser.signOut();
    //     } else {
    //         alert('error');
    //     }

    //     this._refreshStore();
    // }

    // /**
    //  * Метод, реализующий реакцию на отмену подписки
    //  * @param {String} link - ссылка на пользователя
    //  */
    // async _unsub(link) {
    //     const request = await Ajax.unsub(link);

    //     if (request.status === 200) {
    //         actionFriends.getFriends(userStore.user.user_link, 15, 0);
    //         actionFriends.getNotFriends(15, 0);
    //         actionFriends.getSubscribers(userStore.user.user_link, 15);
    //         actionFriends.getSubscriptions(userStore.user.user_link, 15);
    //     } else if (request.status === 401) {
    //         actionUser.signOut();
    //     } else {
    //         alert('error');
    //     }

    //     this._refreshStore();
    // }

    // /**
    //  * Метод, реализующий реакцию на отмену заявки
    //  * @param {String} link - ссылка на пользователя
    //  */
    // async _reject(link) {
    //     const request = await Ajax.reject(link);

    //     if (request.status === 200) {
    //         //ToDo: добавить в локальную шляпу
    //     } else if (request.status === 401) {
    //         actionUser.signOut();
    //     } else {
    //         alert('error');
    //     }

    //     this._refreshStore();
    // }
}

export default new groupsStore();
