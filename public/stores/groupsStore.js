import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {groupAvatarDefault} from "../static/htmlConst.js";

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
        this.manageGroups = [];
        this.findGroups = [];
        this.popularGroups = [];

        this.curGroup = {
            group_link: null, //
            title: null,
            info: null,
            avatar: null,
            privacy: null,
            hideOwner: null,
        };

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
                await this._getGroups(action.count, action.offset);
                break;
            case 'getManageGroups':
                await this._getManageGroups(action.count, action.offset);
                break;
            case 'getNotGroups':
                await this._getNotGroups(action.count, action.offset);
                break;
            case 'getPopularGroups':
                await this._getPopularGroups(action.count, action.offset);
                break;
            case 'getGroupInfo':
                await this._getGroupInfo(action.callback, action.link);
                break;
            case 'createGroup':
                await this._createGroup(action.data);
                break;
            case 'editGroup':
                await this._editGroup(action.data);
                break;
            case 'deleteGroup':
                await this._deleteGroup(action.data);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка групп
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getGroups(count, offset) {
        const request = await Ajax.getGroups(count, offset);
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
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getManageGroups(count, offset) {
        const request = await Ajax.getmanageGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isUserGroup = true;
                if (!group.avatar) {
                    group.avatar = groupAvatarDefault;
                }
            });

            this.manageGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение групп, на которые не подписан пользователь
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getNotGroups(count, offset) {
        const request = await Ajax.getNotGroups(count, offset);
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

    /**
     * Метод, реализующий получение информации о группе
     * @param {Object} link - данные группы
     */
    async _getGroupInfo(callback, link) {
        const request = await Ajax.getGroupInfo(link);
        const response = await request.json();

        if (request.status === 200) {
            console.log(response.body);
            this.curGroup = response.body.group_info;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getGroup error');
        }

        if (callback) {
            callback();
        }
    }

    /**
     * Метод, реализующий реакцию на создание группы
     * @param {Object} data - данные группы
     */
    async _createGroup(data) {
        const request = await Ajax.createGroup(data.title, data.info, data.privacy, data.hideOwner);

        if (request.status === 200) {
            const group = {};

            group.title = data.title;
            group.info = data.info;
            group.privacy = data.privacy;
            group.hideOwner = data.hideOwner;

            this.groups.push(group);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('createGroup error');
        }

        this._refreshStore();
    }
    /**
     * Метод, реализующий реакцию на изменение информации о группе
     * @param {Object} data - данные группы
     */
    async _editGroup(data) {
        const request = await Ajax.editGroup(data.link, data.title, data.info, data.avatar, data.privacy, data.hideOwner);
        if (request.status === 200) {

            if (data.avatar) {
                this.curGroup.avatar = data.avatar;
            }
            this.curGroup.title = data.title;
            this.curGroup.info = data.info;
            this.curGroup.privacy = data.privacy;
            this.curGroup.hideOwner = data.hideOwner;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editGroup error');
        }

        this._refreshStore();
    }

    async _deleteGroup(data) {
        const request = await Ajax.deleteGroup(data.link);
        if (request.status === 200) {

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editGroup error');
        }

        this._refreshStore();
    }
}

export default new groupsStore();
