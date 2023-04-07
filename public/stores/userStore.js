import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {headerConst} from "../static/htmlConst.js";

class userStore {
    constructor() {
        this._callbacks = [];
        this.user = {
            isAuth: false,
            errorAuth: '',
            errorReg: '',

            user_link: null,
            firstName: null,
            lastName: null,
            email: null,
            avatar: null,
        };
        this.users = [];

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
                await this._getProfile(action.link);
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
        } else {
            const response = await request.json();
            this.user.errorAuth = response.message;
        }
        this._refreshStore();
    }

    async _signUp(data) {
        const request = await Ajax.signUp(data.firstName, data.lastName, data.email, data.password);

        if (request.status === 200) {
            this.user.errorReg = '';
            this.user.isAuth = true;
        } else {
            const response = await request.json();
            console.log(response.message);
            this.user.errorReg = response.message;
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

    async _getProfile(link) {
        const request = await Ajax.getProfile(link);
        const response = await request.json();

        if (request.status === 200) {
            this.user.avatar = response.body.profile.avatar;
            this.user.user_link = response.body.profile.user_link;
            this.user.firstName = response.body.profile.first_name;
            this.user.lastName = response.body.profile.last_name;


            if (!this.user.avatar) {
                this.user.avatar = headerConst.avatarDefault;
            }
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
