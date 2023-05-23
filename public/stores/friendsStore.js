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

        this.isMyFriend = 'none';

        this.hasMoreFriends = true;
        this.hasMoreSubscribers = true;
        this.hasMoreSubscriptions = true;
        this.hasMoreUsers = true;


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
                await this._getFriends(action.link, action.count, action.offset, action.isScroll);
                break;
            case 'isFriend':
                await this._isFriend(action.link);
                break;
            case 'getNotFriends':
                await this._getNotFriends(action.link, action.count, action.offset, action.isScroll);
                break;
            case 'getUsers':
                await this._getUsers(action.count, action.offset, action.isScroll);
                break;
            case 'getSub':
                await this._getSub(action.type, action.link, action.count, action.offset, action.isScroll);
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
    async _getFriends(link, count, offset, isScroll=false) {
        const request = await Ajax.getFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.friends && response.body.friends.length !== 0) {
                this.hasMoreFriends = true;
                response.body.friends.forEach((friend) => {
                    friend.isFriend = true;
                    if (!friend.avatar_url) {
                        friend.avatar_url = headerConst.avatarDefault;
                    } else {
                        friend.avatar_url = Ajax.imgUrlConvert(friend.avatar_url);
                    }
                    if (!friend.city) {
                        friend.city = 'город не указан';
                    }
                });
            } else {
                this.hasMoreFriends = false;
            }

            if (isScroll) {
                this.friends.push(...response.body.friends);
            } else {
                this.friends = response.body.friends;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение списка друзей
     * @param {String} link - ссылка пользователя
     */
    async _isFriend(link) {
        const request = await Ajax.isFriend(link);

        this.isMyFriend = 'none';
        if (request.status === 200) {
            const response = await request.json();
            this.isMyFriend = response.body.status;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('isFriend error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение пользователей, которые не являются друзьями
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getNotFriends(link, count, offset, isScroll=false) {
        const request = await Ajax.getNotFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.profiles && response.body.profiles.length !== 0) {
                this.hasMoreUsers = true;
                response.body.profiles.forEach((friend) => {
                    friend.isUser = true;
                    if (!friend.avatar_url) {
                        friend.avatar_url = headerConst.avatarDefault;
                    } else {
                        friend.avatar_url = Ajax.imgUrlConvert(friend.avatar_url);
                    }
                    if (!friend.city) {
                        friend.city = 'город не указан';
                    }
                });
            } else {
                this.hasMoreUsers = false;
            }

            if (isScroll) {
                this.notFriends.push(...response.body.profiles);
            } else {
                this.notFriends = response.body.profiles;
            }
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
    async _getUsers(count, offset, isScroll=false) {
        const request = await Ajax.getUsers(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.profiles && response.body.profiles.length !== 0) {
                this.hasMoreItems = true;
                response.body.profiles.forEach((user) => {
                    if (!user.avatar_url) {
                        user.avatar_url = headerConst.avatarDefault;
                    } else {
                        user.avatar_url = Ajax.imgUrlConvert(user.avatar_url);
                    }
                    if (!user.city) {
                        user.city = 'город не указан';
                    }
                    // if (user.user_link !== userStore.user.user_link) {
                    //     this.users.push(user);
                    // }
                });
            } else {
                this.hasMoreItems = false;
            }

            if (isScroll) {
                this.users.push(...response.body.profiles);
            } else {
                this.users = response.body.profiles;
            }

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
    async _getSub(type, link, count, offset, isScroll=false) {
        const request = await Ajax.getSub(type, link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (type === 'in') {
                if (response.body.subs && response.body.subs.length !== 0) {
                    this.hasMoreSubscribers = true;
                    response.body.subs.forEach((sub) => {
                        if (!sub.avatar_url) {
                            sub.avatar_url = headerConst.avatarDefault;
                        } else {
                            sub.avatar_url = Ajax.imgUrlConvert(sub.avatar_url);
                        }
                        sub.isSubscriber = true;
                    });
                } else {
                    this.hasMoreSubscribers = false;
                }

                if (isScroll) {
                    this.subscribers.push(...response.body.subs);
                } else {
                    this.subscribers = response.body.subs;
                }
            } else {
                if (response.body.subs && response.body.subs.length !== 0) {
                    this.hasMoreSubscriptions = true;
                    response.body.subs.forEach((sub) => {
                        if (!sub.avatar_url) {
                            sub.avatar_url = headerConst.avatarDefault;
                        } else {
                            sub.avatar_url = Ajax.imgUrlConvert(sub.avatar_url);
                        }
                        sub.isSubscribed = true;
                    });
                } else {
                    this.hasMoreSubscriptions = false;
                }

                if (isScroll) {
                    this.subscriptions.push(...response.body.subs);
                } else {
                    this.subscriptions = response.body.subs;
                }
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
            if (this.isMyFriend === 'none') {
                this.isMyFriend = 'subscriber'
            } else if (this.isMyFriend === 'subscribed') {
                this.isMyFriend = 'friend'
            }

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
            if (this.isMyFriend === 'subscriber') {
                this.isMyFriend = 'none'
            } else if (this.isMyFriend === 'friend') {
                this.isMyFriend = 'subscribed'
            }

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
