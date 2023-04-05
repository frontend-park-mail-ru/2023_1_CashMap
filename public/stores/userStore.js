import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class userStore {
    constructor() {
        this._callbacks = [];
        this.user = {
            isAuth: false,

            link: null,
            firstName: null,
            lastName: null,
            email: null,
        };
        this.logoDataSignIn = {
            logoImgPath: 'static/img/logo.svg',
            backgroundImgPath: 'static/img/background_right.svg',
            logoText: 'Depeche',
            logoTagline: 'Сервис для общения',
        };
        this.logoDataSignUp = {
            logoImgPath: 'static/img/logo.svg',
            backgroundImgPath: 'static/img/background_left.svg',
            logoText: 'Depeche',
            logoTagline: 'Сервис для общения',
        };

        this.signInData = {
            title: 'Авторизация',
            inputFields: [
                { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
                { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'}],
            buttonInfo: { text: 'Войти', jsId: 'js-sign-in-btn'},
            errorInfo: { jsId: 'js-sign-in-error' },
            link: { text:'У вас еще нет аккаунта? Зарегистрироваться', jsId: 'js-create-account-btn'},
            linkInfo: 'После успешной регистрации вы получите доступ ко всем функциям Depeche',
        };

        this.signUpData = {
            title: 'Регистрация',
                inputFields: [
                { help: 'Имя', type: 'text', jsIdInput: 'js-first-name-input', jsIdError: 'js-first-name-error'},
                { help: 'Фамилия', type: 'text', jsIdInput: 'js-last-name-input', jsIdError: 'js-last-name-error'},
                { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
                { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'},
                { help: 'Повторите пароль', type: 'password', jsIdInput: 'js-repeat-password-input', jsIdError: 'js-repeat-password-error'}],
                buttonInfo: { text: 'Зарегистрироваться', jsId: 'js-sign-up-btn'},
            link: { text:'У вас уже есть аккаунт? Войти', jsId: 'js-have-account-btn'},
        };

        Dispatcher.register(this.invokeOnDispatch.bind(this));
    }

    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    async invokeOnDispatch(payload) {
        await this._fromDispatch(payload);
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
            default:
                return;
        }
    }

    async _signIn(data) {
        const request = await Ajax.signIn(data.email, data.password);

        if (request.status === 200) {
            this.user.isAuth = true;
            console.log(request.data);

            this._callbacks.forEach((callback) => {
                if (callback) {
                    callback();
                }
            });
        }
    }

    async _signUp(data) {
        const request = await Ajax.signUp(data.firstName, data.lastName, data.email, data.password);

        if (request.status === 200) {
            this.user.isAuth = true;
            console.log(request.data);

            this._callbacks.forEach((callback) => {
                if (callback) {
                    callback();
                }
            });
        }
    }

    async _signOut() {

    }

}

export default new userStore();
