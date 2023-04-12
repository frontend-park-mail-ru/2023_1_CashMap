import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import WebSock from "../modules/webSocket.js";

class userStore {
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
            avatar: null,
            birthday: null,
            status: null,
            lastActive: null,
        };

        this.profile = null;

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    _refreshStore() {
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

    async _signIn(data) {
        const request = await Ajax.signIn(data.email, data.password);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.errorAuth = '';
            this.user.isAuth = true;
            WebSock.open();
        } else {
            const response = await request.json();
            this.user.errorAuth = response.message;
            this.user.isAuth = false;
        }
        this._refreshStore();
    }

    async _signUp(data) {
        const request = await Ajax.signUp(data.firstName, data.lastName, data.email, data.password);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.errorReg = '';
            this.user.isAuth = true;
            WebSock.open();
        } else {
            const response = await request.json();
            this.user.errorReg = response.message;
            this.user.isAuth = false;
        }
        this._refreshStore();
    }

    async _signOut() {
        const request = await Ajax.signOut();

        if (request.status === 200) {
            this.user.isAuth = false;

            if (localStorage.getItem('X-Csrf-Token')) {
                localStorage.removeItem('X-Csrf-Token');
            }
        }
        this._refreshStore();
    }

    async _getProfile(callback, link) {
        const request = await Ajax.getProfile(link);
        const response = await request.json();

        if (request.status === 200) {
            this.user.avatar = response.body.profile.avatar;
            this.user.user_link = response.body.profile.user_link;
            this.user.firstName = response.body.profile.first_name;
            this.user.lastName = response.body.profile.last_name;
            this.user.status = response.body.profile.status;
            this.user.email = response.body.profile.email;

            if (response.body.profile.last_active) {
                const date = new Date(response.body.profile.last_active);
                this.user.lastActive = (new Date(date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
            }

            if (response.body.profile.birthday) {
                const date = new Date(response.body.profile.birthday);
                this.user.birthday = (new Date(date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
            }

            if (!this.user.status) {
                this.user.status = 'статус не задан'
            }

            if (!this.user.avatar) {
                this.user.avatar = headerConst.avatarDefault;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error getUserInfo')
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

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

    async _editProfile(data) {
        const request = await Ajax.editProfile(data.avatar, data.firstName, data.lastName, data.email, data.city, data.birthday, data.status);
        if (request.status === 200 || request.status === 500) {
            if (data.avatar) {
                this.user.avatar = data.avatar;
            }
            this.user.firstName = data.firstName;
            this.user.lastName = data.lastName;
            this.user.email = data.email;
            this.user.city = data.city;
            this.user.birthday = data.birthday;
            this.user.status = data.status;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editProfile error');
        }

        this._refreshStore();
    }
}

export default new userStore();
