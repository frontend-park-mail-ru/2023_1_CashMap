import UserStore from "../stores/userStore.js";
import {actionUser} from "../actions/actionUser.js";
import userStore from "../stores/userStore.js";
import Validation from "../modules/validation.js";
import goToPage, {config} from "../modules/goToPage.js";

export default class SignInView {
    #parent

    constructor(parent) {
        this._addHandlebarsPartial();

        this.#parent = parent;

        this._validateEmail = false;
        this._validatePassword = false;

        UserStore.registerCallback(this.render)
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
    }

    _addPagesListener() {
        this._authBtn.addEventListener('click', (e) => {
            if (this._validatePassword && this._validateEmail) {
                actionUser.signIn({email: this._emailField.value, password: this._passwordField.value});
            }
        });

        this._newBtn.addEventListener('click', (e) => {
            goToPage(config.signUp);
        });

        this._emailField.addEventListener('change', (e) => {
            this._validateEmail = this._validation(this._emailField, this._emailErrorField, 'email');
        });
        this._passwordField.addEventListener('change', (e) => {
            this._validatePassword = this._validation(this._passwordField, this._passwordErrorField, 'password');
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
            const template = Handlebars.templates.signIn;
            this.#parent.innerHTML = template({logoData: userStore.logoDataSignIn, signInData: userStore.signInData});

            this._addPagesElements();

            this._addPagesListener();
        }
    }
}
