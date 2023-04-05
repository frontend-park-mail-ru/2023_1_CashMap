import PostsStore from "../stores/postsStore.js";
import userStore from "../stores/userStore.js";

export default class FeedView {

	#config
	#parent

	constructor(parent) {
		this._addHandlebarsPartial();

		this.#parent = parent;

		PostsStore.registerCallback(this.render)
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
		Handlebars.registerPartial('button', Handlebars.templates.button);
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
		Handlebars.registerPartial('post', Handlebars.templates.post);
		Handlebars.registerPartial('createPost', Handlebars.templates.createPost);
		Handlebars.registerPartial('commentArea', Handlebars.templates.commentArea);
		Handlebars.registerPartial('comment', Handlebars.templates.comment);
	}

	_addPagesElements() {

	}

	_addPagesListener() {

	}

	render() {
		const template = Handlebars.templates.feed;
		this.#parent.innerHTML = template({sideBarData: PostsStore.sideBarData, headerData: PostsStore.headerData, postAreaData: PostsStore.posts});

		this._addPagesElements();

		this._addPagesListener();
	}

}
