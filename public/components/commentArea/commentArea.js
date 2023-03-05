export default class CommentArea {

	#config
	#parent

	constructor(parent, user, staticPaths) {
		this.#parent = parent;

		this.#config = {
			paths: staticPaths,
			user
		};
	}

	render() {
		const template = Handlebars.templates.commentArea;

		const commentAreaBlock = document.createElement('div');
		commentAreaBlock.classList.add('post-comments-section');
		commentAreaBlock.innerHTML = template(this.#config);

		this.#parent.appendChild(commentAreaBlock);

		return commentAreaBlock.querySelector('.comments-list');
	}

}