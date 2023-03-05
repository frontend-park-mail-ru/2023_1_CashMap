export class AuthTable {

	#config
	#parent

	constructor(parent, inputList) {
		this.#parent = parent;

		this.#config = {
			inputList
		};
	}

	render() {
		const template = Handlebars.templates.authTable;
		
		this.#parent.innerHTML += template(this.#config);

        // const input = document.createElement('div');
		// input.classList.add('input-path');

		// const template = Handlebars.templates.input;

		// input.innerHTML = template(this.#config);

		// this.#parent.appendChild(input);
	}

}
