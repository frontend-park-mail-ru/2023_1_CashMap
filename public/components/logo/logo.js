export default class Logo {

    #config
    #parent

    constructor(parent, logoPath, fonPath) {
        this.#parent = parent;

        this.#config = {
            logoPath,
            fonPath,
        };
    }

    render() {
        const template = Handlebars.templates.logo;
        this.#parent.innerHTML = template(this.#config);
    }

}
