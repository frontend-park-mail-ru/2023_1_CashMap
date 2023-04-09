import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";

export default class FeedView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'feed';
		this.curPage = false;
		this.init = false;

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
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._newsItem.style.color = activeColor;
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

		this._msgItem.addEventListener('click', () => {
            Router.go('/message', false);
        });

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/profile', false);
		});

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				const postId = this._editPosts[i].getAttribute("data-id");
				localStorage.setItem('editPostId', postId);
				Router.go('/editPost', false);
			});
		}

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		this._createPosts.addEventListener('click', () => {
			Router.go('/createPost', false);
		});
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		this.init = true;
		actionUser.getProfile(() => { actionPost.getPostsByUser(userStore.user.user_link, 15); });
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

	_preRender() {
		this._template = Handlebars.templates.feed;

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData: {createPostData: {avatar: userStore.user.avatar, jsId: 'js-create-post'}, postList: postsStore.posts},
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}
}
