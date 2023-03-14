export default class Comment {

	#config
	#parent

	constructor(parent, comment, staticPaths) {
		this.#parent = parent;


		const options = { dateStyle: 'medium' };
		comment.date = (new Date(comment.date)).toLocaleDateString('ru-RU', options)
		this.#config = {
			comment,
			paths: staticPaths
		};
	}

	render() {
		const template = Handlebars.templates.comment;

		const commentBlock = document.createElement('div');
		commentBlock.classList.add('comment');
		
		commentBlock.innerHTML = template(this.#config);

		this.#parent.appendChild(commentBlock);
	}

}
