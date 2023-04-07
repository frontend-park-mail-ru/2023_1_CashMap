import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";

export default class FeedView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'feed';
		this.curPage = false;

		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
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
		const exitItem = document.getElementById('js-exit-btn');
		exitItem.addEventListener('click', () => {
			actionUser.signOut();
		})
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				this._render();
			}
		}
	}

	showPage() {
		if (userStore.user.isAuth === false) {
			console.log(userStore.user.isAuth);
			Router.go('/signIn');
		} else {

			actionUser.getUserInfo();
			actionPost.getPosts(10, 0);

			this._render();
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.feed;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData: {createPostData: {avatar: userStore.user.avatar}, postList: postsStore.posts},
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
