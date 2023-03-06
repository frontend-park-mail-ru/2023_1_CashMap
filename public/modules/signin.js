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
        const validPassword = validatePassword(passwordField.value);

        emailField.classList.add('correct-input')
        emailField.classList.remove('incorrect-input')
        passwordField.classList.add('correct-input')
        passwordField.classList.remove('incorrect-input')
        emailErrorField.textContent = ''
        passwordErrorField.textContent = '';

        if (validEmail.status && validPassword.status) {
            // ToDo: Запрос к серверу для проверки данных пользователя

            const request = Ajax.post({url:'http://127.0.0.1:8080/auth/sign-in', body: {body:{"email": emailField.value, "password": passwordField.value}}});
            request
                .then( response => {
                    if (response.status < 300) {
                        // ToDo: нормальный роутинг нужен
                        goToPage(config.feed);

                        //removePage(MAIN_PAGE_SIGNIN);
                        //renderFeedPage();

                        return
                    } else {
                        alert(response.status)
                    }
                    // TODO обработать код ответа
                })
                .catch(response =>{
                    // TODO обработать ошибку
                    console.log(response)

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

        //removePage(MAIN_PAGE_SIGNIN)
        //renderSignupPage()
    });
}