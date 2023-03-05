export class Registration {

	#config
	#parent

	constructor(parent) {
		this.#parent = parent;
	}

	render() {
		const template = Handlebars.templates.registration;
		
		this.#parent.innerHTML += template(this.#config);
	}

}
