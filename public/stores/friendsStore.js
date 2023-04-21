import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";
import {actionFriends} from "../actions/actionFriends.js";

/**
 * класс, хранящий информацию о друзьях
 */
class friendsStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        this.friends = [];
        this.notFriends = [];
        this.users = [];

        this.subscribers = [];
        this.subscriptions = [];

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
            case 'getFriends':
                await this._getFriends(action.link, action.count, action.offset);
                break;
            case 'getNotFriends':
                await this._getNotFriends(action.link, action.count, action.offset);
                break;
            case 'getUsers':
                await this._getUsers(action.count, action.offset);
                break;
            case 'getSub':
                await this._getSub(action.type, action.link, action.count, action.offset);
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
                if (!friend.avatar) {
                    friend.avatar = headerConst.avatarDefault;
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

    /**
     * Метод, реализующий реакцию на получение пользователей, которые не являются друзьями
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getNotFriends(link, count, offset) {
        const request = await Ajax.getNotFriends(link, count, offset);
        const response = await request.json();

        this.notFriends = [];
        if (request.status === 200) {
            response.body.profiles.forEach((friend) => {
                friend.isFriend = false;
                friend.isUser = true;
                if (!friend.avatar) {
                    friend.avatar = headerConst.avatarDefault;
                }
                if (!friend.city) {
                    friend.city = 'город не указан';
                }
                this.notFriends.push(friend);
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение пользователей
     * @param {Number} count - количество получаемых пользователей
     * @param {Number} offset - смещение
     */
    async _getUsers(count, offset) {
        const request = await Ajax.getUsers(count, offset);
        const response = await request.json();

        this.users = [];
        if (request.status === 200) {
            response.body.profiles.forEach((user) => {
                if (!user.avatar) {
                    user.avatar = headerConst.avatarDefault;
                }
                if (!user.city) {
                    user.city = 'город не указан';
                }
                if (user.user_link !== userStore.user.user_link) {
                    this.users.push(user);
                }
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение подписок
     * @param {String} type - тип подписки
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых подписок
     * @param {Number} offset - смещение
     */
    async _getSub(type, link, count, offset) {
        const request = await Ajax.getSub(type, link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (type === 'in') {
                this.subscribers = response.body.subs;
                this.subscribers.forEach((sub) => {
                    if (!sub.avatar) {
                        sub.avatar = headerConst.avatarDefault;
                    }
                    sub.isFriend = false;
                    sub.isSubscriber = true;
                });
            } else {
                this.subscriptions = response.body.subs;
                this.subscriptions.forEach((sub) => {
                    if (!sub.avatar) {
                        sub.avatar = headerConst.avatarDefault;
                    }
                    sub.isFriend = false;
                    sub.isSubscription = true;
                });
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на подписку
     * @param {String} link - ссылка на пользователя
     */
    async _sub(link) {
        const request = await Ajax.sub(link);

        if (request.status === 200) {
            actionFriends.getFriends(userStore.user.user_link, 15, 0);
            actionFriends.getNotFriends(15, 0);
            actionFriends.getSubscribers(userStore.user.user_link, 15);
            actionFriends.getSubscriptions(userStore.user.user_link, 15);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на отмену подписки
     * @param {String} link - ссылка на пользователя
     */
    async _unsub(link) {
        const request = await Ajax.unsub(link);

        if (request.status === 200) {
            actionFriends.getFriends(userStore.user.user_link, 15, 0);
            actionFriends.getNotFriends(15, 0);
            actionFriends.getSubscribers(userStore.user.user_link, 15);
            actionFriends.getSubscriptions(userStore.user.user_link, 15);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на отмену заявки
     * @param {String} link - ссылка на пользователя
     */
    async _reject(link) {
        const request = await Ajax.reject(link);

        if (request.status === 200) {
            //ToDo: добавить в локальную шляпу
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

export default new friendsStore();
