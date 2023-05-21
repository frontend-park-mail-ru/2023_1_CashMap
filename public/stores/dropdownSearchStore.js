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

        this.hasNextUsers = true;
        this.hasNextGroups = true;

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
                await this._getGlobalSearchResult(action.searchText, action.count, action.offset, action.isScroll);
                break;
            default:
                return;
        }
    }

    async _getGlobalSearchResult(searchText, count, offset, isScroll=false) {
        const request = await Ajax.getGlobalSearchResult(searchText, count, offset);

        if (request.status === 200) {
            const response = await request.json();

            // if (response.body.users != null) {
            //     this.userSearchItems = response.body.users;
            // } else {
            //     this.userSearchItems = [];
            // }
            //
            // if (response.body.communitites != null) {
            //     this.communitySearchItems = response.body.communitites;
            // } else {
            //     this.communitySearchItems = [];
            // }

            if (response.body.users && response.body.users.length !== 0) {
                this.hasNextUsers = true;
                response.body.users.forEach((user) => {
                    if (!user.avatar_url) {
                        user.avatar_url = headerConst.avatarDefault;
                    }
                    if (!user.isFriend && !user.isSubscriber && !user.isSubscribed) {
                        user.isUser = true;
                    }
                });
            } else {
                this.hasNextUsers = false;
            }

            if (isScroll) {
                this.userSearchItems.push(...response.body.users);
            } else {
                this.userSearchItems = response.body.users;
            }

            if (response.body.communitites && response.body.communitites.length !== 0) {
                this.hasNextGroups = true;
                response.body.communitites.forEach((community) => {
                    if (!community.avatar_url) {
                        community.avatar_url = headerConst.avatarDefault;
                    }

                    community.isCommunity = true;
                });
            } else {
                this.hasNextGroups = false;
            }

            if (isScroll) {
                this.communitySearchItems.push(...response.body.communitites);
            } else {
                this.communitySearchItems = response.body.communitites;
            }

        } else if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status === 400) {
            this.userSearchItems = [];
            this.communitySearchItems = [];
        } else {
            alert('search error');
        }

        this._refreshStore();
    }

}

export default new DropdownSearchStore();
