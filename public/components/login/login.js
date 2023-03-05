export default class Login {

    #config
    #parent

    constructor(parent, picPath, fonPath) {
        this.#parent = parent;

        this.#config = {
            picPath,
            fonPath,
        };
    }

    render() {
        const template = Handlebars.templates.login;
        this.#parent.innerHTML = template(this.#config);
    }

}