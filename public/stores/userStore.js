import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import Router from "../modules/router.js";

class userStore {
    constructor() {
        this._callbacks = [];
        this.user = {
            isAuth: false,
            errorAuth: '',

            link: null,
            firstName: null,
            lastName: null,
            email: null,
            avatar: null,
        };

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    _refreshStore() {
        //Router.currentPage.render();
        this._callbacks.forEach((callback) => {
            if (callback) {
                callback();
            }
        });
    }

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
            case 'getUserInfo':
                await this._getUserInfo(action.link);
                break;
            case 'checkAuth':
                await this._checkAuth();
                break;
            default:
                return;
        }
    }

    async _signIn(data) {
        const request = await Ajax.signIn(data.email, data.password);

        if (request.status === 200) {
            this.user.errorAuth = '';
            this.user.isAuth = true;
        } else if (request.status === 404) {
            this.user.errorAuth = 'Пользователь не найден';
        } else {
            this.user.errorAuth = 'Ошибка сервера';
        }
        this._refreshStore();
    }

    async _signUp(data) {
        const request = await Ajax.signUp(data.firstName, data.lastName, data.email, data.password);

        if (request.status === 200) {
            this.user.isAuth = true;
        } else {
            if (request.status === 409) {
                this.user.errorAuth = 'Пользователь с таким email уже зарегистрирован';
            } else {
                this.user.errorAuth = 'Ошибка сервера';
            }
        }
        this._refreshStore();
    }

    async _signOut() {
        const request = await Ajax.signOut();

        if (request.status === 200) {
            this.user.isAuth = false;
        }
        this._refreshStore();
    }

    async _getUserInfo(link) {
        const request = await Ajax.getUserInfo(link);
        const response = await request.json();

        if (request.status === 200) {
            this.user.avatar = response.body.avatar;
            this.user.link = response.body.link;
            this.user.email = response.body.email;
            this.user.firstName = response.body.firstName;
            this.user.lastName = response.body.lastName;
        } else {
            alert('error getUserInfo')
        }

        this._refreshStore();
    }

    async _checkAuth() {
        const request = await Ajax.checkAuth();

        if (request.status === 200) {
            this.user.isAuth = true;
        } else {
            this.user.isAuth = false;
        }

        this._refreshStore();
    }
}

export default new userStore();
