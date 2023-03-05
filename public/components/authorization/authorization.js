export class Authorization {

	#config
	#parent

	constructor(parent) {
		this.#parent = parent;
	}

	render() {
		const template = Handlebars.templates.authorization;
		
		this.#parent.innerHTML += template(this.#config);
	}

}
