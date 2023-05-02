import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";

/**
 * класс, хранящий информацию о результатах поиска
 */
class DropdownSearchStore {
    /**
     * @constructor
     * конструктор класса
     */
    constructor() {
        this._callbacks = [];

        this.userSearchItems = [];
        this.communitySearchItems = [];

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
            case 'userSearch':
                await this._getGlobalSearchResult(action.searchText, action.count, action.offset);
                break;
            default:
                return;
        }
    }

    async _getGlobalSearchResult(searchText, count, offset) {
        const request = await Ajax.getGlobalSearchResult(searchText, count, offset);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.users != null) {
                this.userSearchItems = response.body.users;
            } else {
                this.userSearchItems = [];
            }
            this.userSearchItems.forEach((user) => {
                if (!user.avatar_url) {
                    user.avatar_url = headerConst.avatarDefault;
                }
                if (!user.isFriend && !user.isSubscriber && !user.isSubscribed) {
                    user.isUser = true;
                }
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('search error');
        }

        this._refreshStore();
    }

}

export default new DropdownSearchStore();
