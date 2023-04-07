import {actionUser} from "../actions/actionUser.js";
import Validation from "../modules/validation.js";
import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {logoDataSignUp, signUpData} from "../static/htmlConst.js";

export default class SignUpView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-up';
        this.curPage = false;

        this._validateFirstName = false;
        this._validateLastName = false;
        this._validateEmail = false;
        this._validatePassword = false;
        this._validatePasswordRepeat = true;

        userStore.registerCallback(this.updatePage.bind(this))
    }

    _addHandlebarsPartial() {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath)
        Handlebars.registerPartial('signUpPath', Handlebars.templates.signUpPath)
        Handlebars.registerPartial('button', Handlebars.templates.button)
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
    }

    _addPagesElements() {
        this._firstNameField = document.getElementById('js-first-name-input');
        this._firstNameErrorField = document.getElementById('js-first-name-error');
        this._lastNameField = document.getElementById('js-last-name-input');
        this._lastNameErrorField = document.getElementById('js-last-name-error');
        this._emailField = document.getElementById('js-email-input');
        this._emailErrorField = document.getElementById('js-email-error');
        this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
        this._passwordRepeatField = document.getElementById('js-repeat-password-input');
        this._passwordRepeatErrorField = document.getElementById('js-repeat-password-error');
        this._error = document.getElementById('js-sign-up-error');

        this._regBtn = document.getElementById('js-sign-up-btn')
        this._logBtn = document.getElementById('js-have-account-btn')

        this._error.textContent = userStore.user.errorReg;

    }

    _addPagesListener() {
        this._regBtn.addEventListener('click', (e) => {
            if (this._validateFirstName && this._validateLastName && this._validateEmail && this._validatePassword && this._validatePasswordRepeat) {
                actionUser.signUp({firstName: this._firstNameField, lastName: this._lastNameField,email: this._emailField.value, password: this._passwordField.value});
            }
        });

        this._logBtn.addEventListener('click', (e) => {
            Router.go('/signIn');
        });


        this._firstNameField.addEventListener('change', (e) => {
            this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName');
        });
        this._lastNameField.addEventListener('change', (e) => {
            this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName');
        });
        this._emailField.addEventListener('change', (e) => {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email');
        });
        this._passwordField.addEventListener('change', (e) => {
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password');
        });
        this._passwordRepeatField.addEventListener('change', (e) => {
            //this._validatePasswordRepeat = Validation.validation(this._passwordRepeatField, this._passwordRepeatErrorField, 'secondPassword');
        });
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
    }

    updatePage() {
        if (this.curPage) {
            if (userStore.user.isAuth) {
                Router.go('/feed');
            } else {
                this._render();
            }
        }
    }

    showPage() {
        if (userStore.user.isAuth) {
            Router.go('/feed');
        } else {
            this._render();
        }
    }

    _render() {
        const template = Handlebars.templates.signUp;
        Router.rootElement.innerHTML = template({
            logoData: logoDataSignUp,
            signUpData: signUpData
        });

        this._addPagesElements();

        this._addPagesListener();
    }
}
