import Ajax from "./ajax.js";
import goToPage from "./goToPage.js";
import {config} from "./goToPage.js";


/**
 * registration function
 *
 * @returns {}
 */
export default function signIn() {
    const emailField = document.getElementById('js-email-input');
    const emailErrorField = document.getElementById('js-email-error');
    const passwordField = document.getElementById('js-password-input');
    const passwordErrorField = document.getElementById('js-password-error');
    const error = document.getElementById('js-sign-in-error');

    const authBtn = document.getElementById('js-sign-in-btn')
    const newBtn = document.getElementById('js-create-account-btn')

    authBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const validEmail = validateEmail(emailField.value);
        const validPassword = validatePasswordAuth(passwordField.value);

        emailField.classList.add('input-block__field_correct')
        emailField.classList.remove('input-block__field_incorrect')
        passwordField.classList.add('input-block__field_correct')
        passwordField.classList.remove('input-block__field_incorrect')
        emailErrorField.textContent = ''
        passwordErrorField.textContent = '';
        error.textContent = '';

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
                        error.textContent = "Пользователь не найден"
                    } else {
                        error.textContent = "Ошибка сервера"
                    }
                })
        } else {
            if (validEmail.status === false) {
                emailErrorField.textContent = validEmail.error;
                emailField.classList.remove('input-block__field_correct');
                emailField.classList.add('input-block__field_incorrect');
            }
            if (validPassword.status === false) {
                passwordErrorField.textContent = validPassword.error;
                passwordField.classList.remove('input-block__field_correct');
                passwordField.classList.add('input-block__field_incorrect');
            }
        }
    });

    newBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // ToDo: нормальный роутинг нужен
        goToPage(config.signup);
    });
}
