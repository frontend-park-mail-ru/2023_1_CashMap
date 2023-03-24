import Ajax from "./ajax.js";
import goToPage from "./goToPage.js";
import {config} from "./goToPage.js";

/**
 * authorization function
 *
 * @returns {}
 */
export default function signUp() {
    const firstNameField = document.getElementById('js-first-name-input');
    const firstNameErrorField = document.getElementById('js-first-name-error');
    const lastNameField = document.getElementById('js-last-name-input');
    const lastNameErrorField = document.getElementById('js-last-name-error');
    const emailField = document.getElementById('js-email-input');
    const emailErrorField = document.getElementById('js-email-error');
    const passwordField = document.getElementById('js-password-input');
    const passwordErrorField = document.getElementById('js-password-error');
    const passwordRepeatField = document.getElementById('js-repeat-password-input');
    const passwordRepeatErrorField = document.getElementById('js-repeat-password-error');

    const regBtn = document.getElementById('js-sign-up-btn')
    const logBtn = document.getElementById('js-have-account-btn')

    regBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const validEmail = validateEmail(emailField.value);
        const validPassword = validatePassword(passwordField.value);
        const validFirstName = validateName(firstNameField.value);
        const validLastName = validateSurname(lastNameField.value);
        const validTwoPasswords = validateTwoPasswords(passwordField.value, passwordRepeatField.value);

        firstNameField.classList.add('input-block__field_correct')
        firstNameField.classList.remove('input-block__field_incorrect')
        lastNameField.classList.add('input-block__field_correct')
        lastNameField.classList.remove('input-block__field_incorrect')
        emailField.classList.add('input-block__field_correct')
        emailField.classList.remove('input-block__field_incorrect')
        passwordField.classList.add('input-block__field_correct')
        passwordField.classList.remove('input-block__field_incorrect')
        passwordRepeatField.classList.add('input-block__field_correct')
        passwordRepeatField.classList.remove('input-block__field_incorrect')
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
                    }
                    throw response;
                })
                .catch(response => {
                    if (response.status == 409) {
                        emailErrorField.textContent = "Пользователь с таким email уже зарегистрирован";
                    } else {
                        emailErrorField.textContent = "Ошибка сервера"
                    }
                    emailField.classList.remove('input-block__field_correct')
                    emailField.classList.add('input-block__field_incorrect')
                })
        } else {
            if (validEmail.status === false) {
                emailErrorField.textContent = validEmail.error;
                emailField.classList.remove('input-block__field_correct')
                emailField.classList.add('input-block__field_incorrect')
            }
            if (validFirstName.status === false) {
                firstNameErrorField.textContent = validFirstName.error;
                firstNameField.classList.remove('input-block__field_correct')
                firstNameField.classList.add('input-block__field_incorrect')
            }
            if (validLastName.status === false) {
                lastNameErrorField.textContent = validLastName.error;
                lastNameField.classList.remove('input-block__field_correct')
                lastNameField.classList.add('input-block__field_incorrect')
            }
            if (validPassword.status === false) {
                passwordErrorField.textContent = validPassword.error;
                passwordField.classList.remove('input-block__field_correct')
                passwordField.classList.add('input-block__field_incorrect')
            }
            if (validTwoPasswords.status === false) {
                passwordRepeatErrorField.textContent = validTwoPasswords.error;
                passwordRepeatField.classList.remove('input-block__field_correct')
                passwordRepeatField.classList.add('input-block__field_incorrect')
            }
        }
    });

    logBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // ToDo: нормальный роутинг нужен
        goToPage(config.login);
    });
}
