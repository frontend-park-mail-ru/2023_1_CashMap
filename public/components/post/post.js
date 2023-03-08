export default class Post {

	#config
	#parent

	constructor(parent, postData, staticPaths) {
		this.#parent = parent;

		const options = { dateStyle: 'medium' };
		postData.date = (new Date(postData.date)).toLocaleDateString('ru-RU', options)
		postData.commentsNumber = postData.comments.length;

		this.#config = {
			post: postData,
			paths: staticPaths
		};
	}

	render() {
		const template = Handlebars.templates.post;

		let post = document.createElement('div');
		post.classList.add('post');
		post.innerHTML += template(this.#config);
		this.#parent.appendChild(post);

		return post;
	}

}