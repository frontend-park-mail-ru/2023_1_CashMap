import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";

/**
 * класс, хранящий информацию о группе
 */
class groupStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];
        this.group = {
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
            case 'getGroup':
                await this._getGroup(action.callback, action.link);
                break;
            case 'createGroup':
                await this._createGroup(action.data);
                break;
            case 'editGroup':
                await this._editGroup(action.data);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на создание группы
     * @param {Object} data - данные группы
     */
    async _createGroup(data) {
        const request = await Ajax.createGroup(data.title, data.info, data.privacy, data.hideOwner);
        alert(1);
        if (request.status === 200) {
            this.group.title = data.title;
            this.group.info = data.info;
            this.group.privacy = data.privacy;
            this.group.hideOwner = data.hideOwner;
            console.log(request);
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
        const request = await Ajax.editGroup(data.title, data.info, data.avatar, data.privacy, data.hideOwner);
        if (request.status === 200) {
            if (data.avatar) {
                this.group.avatar = data.avatar;
            }
            this.group.title = data.title;
            this.group.info = data.info;
            this.group.privacy = data.privacy;
            this.group.hideOwner = data.hideOwner;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editGroup error');
        }

        this._refreshStore();
    }
}

export default new groupStore();
