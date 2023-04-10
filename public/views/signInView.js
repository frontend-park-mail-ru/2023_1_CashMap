import userStore from "../stores/userStore.js";
import {actionUser} from "../actions/actionUser.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import {logoDataSignIn, signInData} from "../static/htmlConst.js";
import {actionPost} from "../actions/actionPost.js";

export default class SignInView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-in';
        this.curPage = false;
        this.init = true;

        this._validateEmail = false;
        this._validatePassword = false;

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
        this._error = document.getElementById('js-sign-in-error');
        this._authBtn = document.getElementById('js-sign-in-btn')
        this._newBtn = document.getElementById('js-create-account-btn')

        this._error.textContent = userStore.user.errorAuth;
    }

    _addPagesListener() {
        this._authBtn.addEventListener('click', (e) => {
            if (this._validatePassword && this._validateEmail) {
                actionUser.signIn({email: this._emailField.value, password: this._passwordField.value});
            }
        });

        this._newBtn.addEventListener('click', (e) => {
            Router.go('/signUp', false);
        });

        this._emailField.addEventListener('change', (e) => {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email');
        });
        this._passwordField.addEventListener('change', (e) => {
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password');
        });
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
    }

    showPage() {
        /*this.init = true;
        actionUser.checkAuth();*/
    }

    updatePage() {
        if (this.curPage) {
            if (userStore.user.isAuth) {
                console.log('auth');
                actionUser.getProfile(() => { actionPost.getPostsByUser(userStore.user.user_link, 15); });
                Router.go('/feed');
                return;
            }
            this._render();
        }
    }

    _preRender() {
        this._template = Handlebars.templates.signIn;

        this._context = {
            logoData: logoDataSignIn,
            signInData: signInData
        }
    }

    _render() {
        this._preRender();
        Router.rootElement.innerHTML = this._template(this._context);
        this._addPagesElements();
        this._addPagesListener();
    }
}
