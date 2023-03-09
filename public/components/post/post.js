export class Post {

	#config
	#parent

	constructor(parent, postData, staticPaths) {
		this.#parent = parent;

		this.#config = {
			post: postData,
			paths: staticPaths
		};
	}

	render() {
		const template = Handlebars.templates.post;
		
		this.#parent.innerHTML += template(this.#config);
	}

}