import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import WebSock from "../modules/webSocket.js";
import groupsStore from "./groupsStore.js";
import Router from "../modules/router.js";
import DateConvert from "../modules/dateConvert.js";

/**
 * класс, хранящий информацию о друзьях
 */
class userStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];
        this.user = {
            isAuth: false,
            errorAuth: '',
            errorReg: '',

            email: null,
            user_link: null,
            firstName: null,
            lastName: null,
            avatar_url: null,
            avg_avatar_color: null,
            bio: null,
            birthday: null,
            status: null,
            lastActive: null,
        };

        this.userProfile = {
            isAuth: false,
            errorAuth: '',
            errorReg: '',

            email: null,
            user_link: null,
            firstName: null,
            lastName: null,
            avatar_url: null,
            avg_avatar_color: null,
            bio: null,
            birthday: null,
            status: null,
            lastActive: null,
        };

        this.editMsg = '';
        this.editStatus = null;
        this.profile = null;

        this.fields = null;

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
            case 'signIn':
                await this._signIn(action.data);
                break;
            case 'signUp':
                await this._signUp(action.data);
                break;
            case 'signOut':
                await this._signOut();
                break;
            case 'getProfile':
                await this._getProfile(action.callback, action.link);
                break;
            case 'checkAuth':
                await this._checkAuth(action.callback);
                break;
            case 'editProfile':
                await this._editProfile(action.data);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на вход
     * @param {Object} data - данные для входа
     */
    async _signIn(data) {
        const request = await Ajax.signIn(data.email, data.password);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            this.fields = null;
            WebSock.open();
        } else {
            this.user.errorAuth = 'Неверный email или пароль.';
            this.user.isAuth = false;
            this.fields = {email: data.email, password: data.password };
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на регистрацию
     * @param {Object} data - данные для входа
     */
    async _signUp(data) {
        const request = await Ajax.signUp(data.firstName, data.lastName, data.email, data.password, data.password2);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            this.fields = null;
            WebSock.open();
        } else {
            const response = await request.json();
            this.user.errorReg = response.message;
            this.user.isAuth = false;
            this.fields = {firstName: data.firstName, lastName: data.lastName, email: data.email, password1: data.password, password2: data.password2 };
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на выход
     */
    async _signOut() {
        const request = await Ajax.signOut();

        this.user.isAuth = false;
        this.editMsg = '';
        this.editStatus = null;
        groupsStore.editMsg = '';
        groupsStore.editStatus = null;

        if (localStorage.getItem('X-Csrf-Token')) {
            localStorage.removeItem('X-Csrf-Token');
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение информации о пользователе
     * @param {String} link - ссылка на пользователя
     */
    async _getProfile(callback, link) {
        const request = await Ajax.getProfile(link);
        const response = await request.json();

        if (request.status === 200) {
            let profile = {};

            profile.avatar_url = response.body.profile.avatar_url;
            profile.avg_avatar_color = response.body.profile.avg_avatar_color;
            profile.user_link = response.body.profile.user_link;
            profile.firstName = response.body.profile.first_name;
            profile.lastName = response.body.profile.last_name;
            profile.bio = response.body.profile.bio;
            profile.status = response.body.profile.status;
            profile.email = response.body.profile.email;

            if (response.body.profile.last_active) {
                if (response.body.profile.last_active === 'now') {
                    profile.lastActive = 'онлайн';
                } else {
                    profile.lastActive = 'был в сети: ' + DateConvert.fromBackToPost(response.body.profile.last_active);
                }
            }

            if (response.body.profile.birthday) {
                profile.birthday = response.body.profile.birthday;
            }

            if (!profile.status) {
                profile.status = 'статус не задан'
            }

            if (!profile.avatar_url) {
                profile.avatar_url = headerConst.avatarDefault;
            } else {
                profile.avatar_url = Ajax.imgUrlConvert(profile.avatar_url);
            }

            if (!link || link === this.user.user_link) {
                profile.isAuth = true;
                this.user = profile;
            } else {
                this.userProfile = profile;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status === 404) {
            Router.go('/404');
        } else {
            alert('error getUserInfo')
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на проверку авторизации пользователя
     */
    async _checkAuth(callback) {
        const request = await Ajax.checkAuth();

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            WebSock.open();
        } else {
            this.user.isAuth = false;
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на изменение информации о пользователе
     * @param {Object} data - данные пользователя
     */
    async _editProfile(data) {
        const request = await Ajax.editProfile(data.avatar_url, data.firstName, data.lastName, data.bio, data.birthday, data.status);
        if (request.status === 200) {
            if (data.avatar_url) {
                this.user.avatar_url = Ajax.imgUrlConvert(data.avatar_url);
            }

            this.user.firstName = data.firstName;
            this.user.lastName = data.lastName;
            this.user.bio = data.bio;
            this.user.birthday = data.birthday;
            this.user.status = data.status;

            this.editMsg = 'Данные профиля успешно обновлены';
            this.editStatus = true;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            this.editMsg = 'Ошибка сервера';
            this.editStatus = false;
        }

        this._refreshStore();
    }
}

export default new userStore();
