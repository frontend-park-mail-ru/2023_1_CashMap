import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";

/**
 * класс, хранящий информацию о результатах поиска
 */
class DropdownFriendsSearchStore {
    /**
     * @constructor
     * конструктор класса
     */
    constructor() {
        this._callbacks = [];

        this.friends = [];

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
            case 'friendsSearch':
                await this._getFriends(action.link, action.count, action.offset);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка друзей
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getFriends(link, count, offset) {
        const request = await Ajax.getFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.friends.forEach((friend) => {
                friend.isFriend = true;
                if (!friend.avatar_url) {
                    friend.avatar_url = headerConst.avatarDefault;
                } else {
                    friend.avatar_url = `https://${Ajax.backendHostname}/${ friend.avatar_url }`;
                }
                if (!friend.city) {
                    friend.city = 'город не указан';
                }
            });

            this.friends = response.body.friends;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

export default new DropdownFriendsSearchStore();
