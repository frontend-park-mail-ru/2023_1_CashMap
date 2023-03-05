export default class Header {
    #parent
    #config

    constructor(parent) {
        this.#parent = parent;
    }

    get config() {
        return this.#config
    }

    set config({profileUrl, avatar}) {
        this.#config = {
            profileUrl,
            avatar,
        }
    }

    render() {
        let header = document.createElement('div');
        header.classList.add('header');

        const template = Handlebars.templates.header;
        header.innerHTML = template(this.#config)
        this.#parent.appendChild(header)
    }
}