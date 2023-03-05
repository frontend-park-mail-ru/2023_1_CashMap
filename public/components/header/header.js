export class Header {
    #parent
    #config

    constructor(parent) {
        this.#parent = parent;
    }

    get config() {
        return this.#config
    }

    set config(value) {
        this.#config = value
    }

    render() {
        
    }
}