import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";

export default class EditPostView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'edit-post';
		this.curPage = false;

		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
		Handlebars.registerPartial('button', Handlebars.templates.button);
		Handlebars.registerPartial('buttonDefault', Handlebars.templates.buttonDefault);
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
		Handlebars.registerPartial('editPost', Handlebars.templates.editPost);
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._text = document.getElementById('js-edit-post-textarea');
		this._text.focus();
		this._feedBtn = document.getElementById('js-logo-go-feed');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._newsItem.style.color = activeColor;
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		this._editBtn = document.getElementById('js-edit-post-btn');
		let textarea = document.getElementsByTagName('textarea');

		textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
		textarea[0].addEventListener("input", OnInput, false);

		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });
		
		this._feedBtn.addEventListener('click', () => {
            Router.go('/feed', false);
        });

		this._editBtn.addEventListener('click', () => {
			const postId = localStorage.getItem('editPostId');
			if (postId) {
				actionPost.editPost(this._text.value, postId);
			}
			Router.goBack();
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/user', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._groupsItem.addEventListener('click', () => {
			Router.go('/groups', false);
		});
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		actionUser.getProfile(() => {
			const postId = localStorage.getItem('editPostId');
			if (postId) {
				actionPost.getPostsById(postId, 1);
			} else {
				Router.goBack();
			}
		});
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
		this._template = Handlebars.templates.editPostPage;

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			editPostData: {
				avatar: userStore.user.avatar,
				text: postsStore.curPost.text_content,
				id: postsStore.curPost.id,
				buttonData: {
					text: 'Опубликовать',
					jsId: 'js-edit-post-btn'
				}
			},
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}
}
