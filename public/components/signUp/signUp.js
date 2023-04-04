export default class SignUp {

    #config
    #parent

    constructor(parent) {
        this.#parent = parent;

        this.#config = {
            logoData: {
                logoImgPath: 'static/img/logo.svg',
                backgroundImgPath: 'static/img/background_left.svg',
                logoText: 'Depeche',
                logoTagline: 'Сервис для общения',
            },
            signInData: {
                title: 'Регистрация',
                inputFields:
                    [
                    { help: 'Имя',
                      type: 'text',
                      jsIdInput: 'js-first-name-input',
                      jsIdError: 'js-first-name-error'},
                    { help: 'Фамилия',
                      type: 'text',
                      jsIdInput: 'js-last-name-input',
                      jsIdError: 'js-last-name-error'},
                    { help: 'Электронная почта',
                      type: 'email',
                      jsIdInput: 'js-email-input',
                      jsIdError: 'js-email-error'},
                    { help: 'Пароль',
                      type: 'password',
                      jsIdInput: 'js-password-input',
                      jsIdError: 'js-password-error'},
                    { help: 'Повторите пароль',
                      type: 'password',
                      jsIdInput: 'js-repeat-password-input',
                      jsIdError: 'js-repeat-password-error'}
                    ],
                buttonInfo: { text: 'Зарегистрироваться',
                    jsId: 'js-sign-up-btn'},
                link: { text:'У вас уже есть аккаунт? Войти',
                    jsId: 'js-have-account-btn'},
            },
        };
    }

    render() {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath)
        Handlebars.registerPartial('signUpPath', Handlebars.templates.signUpPath)
        Handlebars.registerPartial('button', Handlebars.templates.button)
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField)

        const template = Handlebars.templates.signUp;
        this.#parent.innerHTML = template(this.#config);
    }

}
