export default class SignInView {

    #config
    #parent

    constructor(parent) {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath);
        Handlebars.registerPartial('signInPath', Handlebars.templates.signInPath);
        Handlebars.registerPartial('button', Handlebars.templates.button);
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField);

        this.#parent = parent;

        this.#config = {
            logoData: {
                logoImgPath: 'static/img/logo.svg',
                backgroundImgPath: 'static/img/background_right.svg',
                logoText: 'Depeche',
                logoTagline: 'Сервис для общения',
            },
            signInData: {
                title: 'Авторизация',
                inputFields: [{ help: 'Электронная почта',
                    type: 'email',
                    jsIdInput: 'js-email-input',
                    jsIdError: 'js-email-error'},
                    { help: 'Пароль',
                        type: 'password',
                        jsIdInput: 'js-password-input',
                        jsIdError: 'js-password-error'}],
                buttonInfo: { text: 'Войти',
                    jsId: 'js-sign-in-btn'},
                errorInfo: { jsId: 'js-sign-in-error' },
                link: { text:'У вас еще нет аккаунта? Зарегистрироваться',
                    jsId: 'js-create-account-btn'},
                linkInfo: 'После успешной регистрации вы получите доступ ко всем функциям Depeche',
            },
        };
    }

    render() {
        const template = Handlebars.templates.signIn;
        this.#parent.innerHTML = template(this.#config);
    }

}
