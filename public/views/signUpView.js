import {actionUser} from "../actions/actionUser.js";
import Validation from "../modules/validation.js";
import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { logoDataSignUp, signInData, signUpData } from "../static/htmlConst.js";

export default class SignUpView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-up';
        this.curPage = false;

        this._validateFirstName = false;
        this._validateLastName = false;
        this._validateEmail = false;
        this._validatePassword = false;
        this._validatePasswordRepeat = false;

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

        this._regBtn = document.getElementById('js-sign-up-btn');
        this._logBtn = document.getElementById('js-have-account-btn');
    }

    _addPagesListener() {
        this._regBtn.addEventListener('click', () => {
            if (this._validateFirstName && this._validateLastName && this._validateEmail && this._validatePassword && this._validatePasswordRepeat) {
                actionUser.signUp({firstName: this._firstNameField.value, lastName: this._lastNameField.value, email: this._emailField.value, password: this._passwordField.value, password2: this._passwordRepeatField.value});
                userStore.fields = null;
            } else {
                userStore.user.errorReg = 'Заполните корректно все поля';
                userStore.fields = {firstName: this._firstNameField.value, lastName: this._lastNameField.value, email: this._emailField.value, password1: this._passwordField.value, password2: this._passwordRepeatField.value};
                this._render();
            }
        });

        this._logBtn.addEventListener('click', () => {
            Router.go('/sign-in', false);
        });


        this._firstNameField.addEventListener('input', () => {
            this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName', 'default');
        });
        this._lastNameField.addEventListener('input', () => {
            this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName', 'default');
        });
        this._emailField.addEventListener('input', () => {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email', 'default');
        });
        this._passwordField.addEventListener('input', () => {
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
        });
        this._passwordRepeatField.addEventListener('input', () => {
            this._validatePasswordRepeat = Validation.validationPassword(this._passwordField, this._passwordRepeatField, this._passwordRepeatErrorField, 'default');
        });

        if (userStore.fields) {
            this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName', 'default');
            this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName', 'default');
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email', 'default');
            this._validatePassword = Validation.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
            this._validatePasswordRepeat = Validation.validationPassword(this._passwordField, this._passwordRepeatField, this._passwordRepeatErrorField, 'default');
        }
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
        userStore.user.errorReg = '';
        userStore.fields = null;
    }

    showPage() {
        actionUser.checkAuth();
    }

    updatePage() {
        if (this.curPage) {
            if (userStore.user.isAuth) {
                actionUser.getProfile();
                Router.go('/feed');
            } else {
                this._render();
            }
        }
    }

    _preRender() {
        this._template = Handlebars.templates.signUp;

        if (userStore.user.errorReg) {
            signUpData.errorInfo['errorText'] = userStore.user.errorReg;
            signUpData.errorInfo['errorClass'] = 'display-inline-grid';
        } else {
            signUpData.errorInfo['errorText'] = '';
            signUpData.errorInfo['errorClass'] = 'display-none';
        }

        if (userStore.fields) {
            signUpData.inputFields[0].text = userStore.fields.firstName;
            signUpData.inputFields[1].text = userStore.fields.lastName;
            signUpData.inputFields[2].text = userStore.fields.email;
            signUpData.inputFields[3].text = userStore.fields.password1;
            signUpData.inputFields[4].text = userStore.fields.password2;
        }

        this._context = {
            logoData: logoDataSignUp,
            signUpData: signUpData,
        }

        document.title = 'Регистрация';
    }

    _render() {
        this._preRender();
        Router.rootElement.innerHTML = this._template(this._context);
        this._addPagesElements();
        this._addPagesListener();
    }
}
