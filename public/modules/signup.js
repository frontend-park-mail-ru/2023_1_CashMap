import Ajax from "./ajax.js";
import goToPage from "./goToPage.js";
import {config} from "./goToPage.js";

/**
 * authorization function
 *
 * @returns {}
 */
export default function signUp() {
    const firstNameField = document.getElementById('first-name');
    const firstNameErrorField = document.getElementById('first-name-error');
    const lastNameField = document.getElementById('last-name');
    const lastNameErrorField = document.getElementById('last-name-error');
    const emailField = document.getElementById('email');
    const emailErrorField = document.getElementById('reg-email-error');
    const passwordField = document.getElementById('password');
    const passwordErrorField = document.getElementById('reg-password-error');
    const passwordRepeatField = document.getElementById('repeat-password');
    const passwordRepeatErrorField = document.getElementById('repeat-password-error');

    const regBtn = document.getElementById('reg-btn')
    const logBtn = document.getElementById('log-btn')

    regBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const validEmail = validateEmail(emailField.value);
        const validPassword = validatePassword(passwordField.value);
        const validFirstName = validateName(firstNameField.value);
        const validLastName = validateSurname(lastNameField.value);
        const validTwoPasswords = validateTwoPasswords(passwordField.value, passwordRepeatField.value);

        firstNameField.classList.add('correct-input')
        firstNameField.classList.remove('incorrect-input')
        lastNameField.classList.add('correct-input')
        lastNameField.classList.remove('incorrect-input')
        emailField.classList.add('correct-input')
        emailField.classList.remove('incorrect-input')
        passwordField.classList.add('correct-input')
        passwordField.classList.remove('incorrect-input')
        passwordRepeatField.classList.add('correct-input')
        passwordRepeatField.classList.remove('incorrect-input')
        firstNameErrorField.textContent = '';
        lastNameErrorField.textContent = '';
        emailErrorField.textContent = '';
        passwordErrorField.textContent = '';
        passwordRepeatErrorField.textContent = '';


        if (validEmail.status && validPassword.status && validFirstName.status && validLastName.status && validTwoPasswords.status) {
            // ToDo: Запрос к серверу для проверки данных пользователя

            const request = Ajax.post('/auth/sign-up', {"email": emailField.value, "password": passwordField.value});
            request
                .then( response => {
                    if (response.status === 200) {
                        goToPage(config.login);
                        return
                    } else {
                        alert(response.message)
                    }
                })
                .catch(response =>{
                    alert('catch '+ response.message)
                })
        } else {
            if (validEmail.status === false) {
                emailErrorField.textContent = validEmail.error;
                emailField.classList.remove('correct-input')
                emailField.classList.add('incorrect-input')
            }
            if (validFirstName.status === false) {
                firstNameErrorField.textContent = validFirstName.error;
                firstNameField.classList.remove('correct-input')
                firstNameField.classList.add('incorrect-input')
            }
            if (validLastName.status === false) {
                lastNameErrorField.textContent = validLastName.error;
                lastNameField.classList.remove('correct-input')
                lastNameField.classList.add('incorrect-input')
            }
            if (validPassword.status === false) {
                passwordErrorField.textContent = validPassword.error;
                passwordField.classList.remove('correct-input')
                passwordField.classList.add('incorrect-input')
            }
            if (validTwoPasswords.status === false) {
                passwordRepeatErrorField.textContent = validTwoPasswords.error;
                passwordRepeatField.classList.remove('correct-input')
                passwordRepeatField.classList.add('incorrect-input')
            }
        }
    });

    logBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // ToDo: нормальный роутинг нужен
        goToPage(config.login);
    });
}