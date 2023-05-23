import userStore from "../stores/userStore.js";
import {actionUser} from "../actions/actionUser.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import {logoDataSignIn, signInData} from "../static/htmlConst.js";

export default class SignInView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-in';
        this.curPage = false;

        this._validateEmail = false;
        this._validatePassword = false;

        this._fields = null;

        userStore.registerCallback(this.updatePage.bind(this))
    }

    _addHandlebarsPartial() {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath);
        Handlebars.registerPartial('signInPath', Handlebars.templates.signInPath);
        Handlebars.registerPartial('button', Handlebars.templates.button);
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
    }

    _addPagesElements() {
        this._emailField = document.getElementById('js-email-input');
        this._emailErrorField = document.getElementById('js-email-error');
        this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
        this._authBtn = document.getElementById('js-sign-in-btn')
        this._newBtn = document.getElementById('js-create-account-btn')
    }

    _addPagesListener() {
        this._authBtn.addEventListener('click', () => {
            if (this._validatePassword && this._validateEmail) {
                actionUser.signIn({email: this._emailField.value, password: this._passwordField.value});
                this._fields = null;
            } else {
                userStore.user.errorAuth = 'Заполните корректно все поля';
                this._fields = {email: this._emailField.value, password: this._passwordField.value };
                this._render();
            }
        });

        this._newBtn.addEventListener('click', () => {
            Router.go('/signUp', false);
        });

        this._emailField.addEventListener('change', () => {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email', 'default');
        });
        this._passwordField.addEventListener('change', () => {
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
        });

        if (this._fields) {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email', 'default');
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
        }
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
        userStore.user.errorAuth = '';
    }

    showPage() {
        actionUser.checkAuth();
    }

    updatePage() {
        if (this.curPage) {
            if (userStore.user.isAuth) {
                Router.go('/feed');
                return;
            }
            this._render();
        }
    }

    _preRender() {
        this._template = Handlebars.templates.signIn;

        if (userStore.user.errorAuth) {
            signInData.errorInfo['errorText'] = userStore.user.errorAuth;
            signInData.errorInfo['errorClass'] = 'display-inline-grid';
        } else {
            signInData.errorInfo['errorText'] = '';
            signInData.errorInfo['errorClass'] = 'display-none';
        }

        if (this._fields) {
            signInData.inputFields[0].text = this._fields.email;
            signInData.inputFields[1].text = this._fields.password;
        }

        this._context = {
            logoData: logoDataSignIn,
            signInData: signInData,
        }

        document.title = 'Авторизация';
    }

    _render() {
        this._preRender();
        Router.rootElement.innerHTML = this._template(this._context);
        this._addPagesElements();
        this._addPagesListener();
    }
}
