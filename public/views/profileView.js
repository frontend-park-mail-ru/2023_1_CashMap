import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";
import { actionMessage } from "../actions/actionMessage.js";

export default class ProfileView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'profile';
		this.curPage = false;
		this._userLink = null;

		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('profileCard', Handlebars.templates.profileCard)
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea)
		Handlebars.registerPartial('post', Handlebars.templates.post)
		Handlebars.registerPartial('createPost', Handlebars.templates.createPost)
		Handlebars.registerPartial('commentArea', Handlebars.templates.commentArea)
		Handlebars.registerPartial('comment', Handlebars.templates.comment)
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._profileSettingsBtn = document.getElementById('js-profile-settings-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._myPageItem.style.color = activeColor;
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
		this._goMsg = document.getElementById('js-go-msg');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
				Router.go('/settings', false);
		});

		/*this._profileSettingsBtn.addEventListener('click', () => {
				Router.go('/settings', false);
		});*/

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
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

		this._goMsg.addEventListener('click', () => {
			const userId = this._goMsg.getAttribute("data-id");
			alert(userId)
			actionMessage.chatCheck(userId, () => {
				if (localStorage.getItem('chatFriendId')) {
					localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
					Router.go('/chat');
					actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
				} else {
					actionMessage.chatCreate(userId, () => {
						if (localStorage.getItem('chatId')) {
							Router.go('/chat');
							actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
						}
					});
				}
			});
		});
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage(search) {
		if (search.link) {
			this._userLink = search.link;
		} else {
			this._userLink = userStore.user.user_link;
		}
		actionUser.getProfile(() => { actionPost.getPostsByUser(this._userLink, 15); }, this._userLink);
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
		this._template = Handlebars.templates.profile;

		userStore.userProfile.isMyPage = true;
		if (this._userLink === userStore.user.user_link) {
			userStore.userProfile = userStore.user;
		} else {
			userStore.userProfile.isMyPage = false;
		}

		let header = headerConst;
		header['avatar'] = userStore.userProfile.avatar;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			profileData: userStore.userProfile,
			postAreaData: {createPostData: {avatar: userStore.userProfile.avatar, jsId: 'js-create-post'}, postList: postsStore.posts},
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}
}
