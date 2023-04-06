import UserStore from "../stores/userStore.js";
import {actionUser} from "../actions/actionUser.js";
import Validation from "../modules/validation.js";
import userStore from "../stores/userStore.js";
import goToPage, {config} from "../modules/goToPage.js";

export default class SignUpView {
    #parent

    constructor(parent) {
        this._addHandlebarsPartial();

        this.#parent = parent;

        this._validateFirstName = false;
        this._validateLastName = false;
        this._validateEmail = false;
        this._validatePassword = false;
        this._validatePasswordRepeat = true;

        UserStore.registerCallback(this.render)
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

        this._regBtn = document.getElementById('js-sign-up-btn')
        this._logBtn = document.getElementById('js-have-account-btn')
    }

    _addPagesListener() {
        this._regBtn.addEventListener('click', (e) => {
            if (this._validateFirstName && this._validateLastName && this._validateEmail && this._validatePassword && this._validatePasswordRepeat) {
                actionUser.signUp({email: this._emailField.value, password: this._passwordField.value});
            }
        });

        this._logBtn.addEventListener('click', (e) => {
            goToPage(config.signIn);
        });



        this._firstNameField.addEventListener('change', (e) => {
            this._validateFirstName = this._validation(this._firstNameField, this._firstNameErrorField, 'firstName');
        });
        this._lastNameField.addEventListener('change', (e) => {
            this._validateLastName = this._validation(this._lastNameField, this._lastNameErrorField, 'lastName');
        });
        this._emailField.addEventListener('change', (e) => {
            this._validateEmail = this._validation(this._emailField, this._emailErrorField, 'email');
        });
        this._passwordField.addEventListener('change', (e) => {
            this._validatePassword = this._validation(this._passwordField, this._passwordErrorField, 'password');
        });
        this._passwordRepeatField.addEventListener('change', (e) => {
            //this._validatePasswordRepeat = this._validation(this._passwordRepeatField, this._passwordRepeatErrorField, 'secondPassword');
        });
    }

    _validation(inputField, errorField, type) {
        const validationRes = Validation.validate(inputField.value, type);

        if (validationRes.status === false) {
            errorField.textContent = validationRes.error;
            inputField.classList.remove('input-block__field-correct');
            inputField.classList.add('input-block__field-incorrect');

            return false;
        } else {
            errorField.textContent = '';
            inputField.classList.add('input-block__field-correct');
            inputField.classList.remove('input-block__field-incorrect');

            return true;
        }
    }

    render() {
        if (userStore.user.isAuth) {
            goToPage(config.feed);
        } else {
            const template = Handlebars.templates.signUp;
            this.#parent.innerHTML = template({logoData: userStore.logoDataSignUp, signUpData: userStore.signUpData});

            this._addPagesElements();

            this._addPagesListener();
        }
    }
}