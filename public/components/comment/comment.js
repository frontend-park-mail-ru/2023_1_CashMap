export default class Comment {

	#config
	#parent

	constructor(parent, comment, staticPaths) {
		this.#parent = parent;

		this.#config = {
			comment,
			paths: staticPaths
		};
	}

	render() {
		const template = Handlebars.templates.comment;
		
		this.#parent.innerHTML = template(this.#config);
	}

}