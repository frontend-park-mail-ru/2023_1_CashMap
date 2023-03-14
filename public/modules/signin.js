import Ajax from "./ajax.js";
import goToPage from "./goToPage.js";
import {config} from "./goToPage.js";


/**
 * registration function
 *
 * @returns {}
 */
export default function signIn() {
    const emailField = document.getElementById('email-field');
    const emailErrorField = document.getElementById('email-error');
    const passwordField = document.getElementById('password-field');
    const passwordErrorField = document.getElementById('password-error');

    const authBtn = document.getElementById('auth')
    const newBtn = document.getElementById('new')

    authBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const validEmail = validateEmail(emailField.value);
        const validPassword = validatePasswordAuth(passwordField.value);

        emailField.classList.add('correct-input')
        emailField.classList.remove('incorrect-input')
        passwordField.classList.add('correct-input')
        passwordField.classList.remove('incorrect-input')
        emailErrorField.textContent = ''
        passwordErrorField.textContent = '';

        if (validEmail.status && validPassword.status) {
            const request = Ajax.post('/auth/sign-in', {"email": emailField.value, "password": passwordField.value});
            request
                .then( response => {
                    if (response.status === 200) {
                        goToPage(config.feed);
                        return
                    }

                    throw response;
                })
                .catch( response => {
                    if (response.status == "404") {
                        emailErrorField.textContent = "Пользователь не найден"
                    } else {
                        emailErrorField.textContent = "Ошибка сервера"
                    }
                    emailField.classList.remove('correct-input')
                    emailField.classList.add('incorrect-input')
                })
        } else {
            if (validEmail.status === false) {
                emailErrorField.textContent = validEmail.error;
                emailField.classList.remove('correct-input')
                emailField.classList.add('incorrect-input')
            }
            if (validPassword.status === false) {
                passwordErrorField.textContent = validPassword.error;
                passwordField.classList.remove('correct-input')
                passwordField.classList.add('incorrect-input')
            }
        }
    });

    newBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // ToDo: нормальный роутинг нужен
        goToPage(config.signup);
    });
}
