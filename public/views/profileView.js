import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor, maxTextStrings, maxTextLength} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";
import BaseView from "./baseView.js";
import { actionMessage } from "../actions/actionMessage.js";

export default class ProfileView extends BaseView {
	constructor() {
		super();

		this._jsId = 'profile';
		this.curPage = false;
		this._userLink = null;
	}

	addStore() {
		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._profileSettingsBtn = document.getElementById('js-profile-settings-btn');

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');
		this._createPosts = document.getElementById('js-create-post');
		this._goMsg = document.getElementById('js-go-msg');
		this._posts = document.getElementsByClassName('post-text');
	}

	addPagesListener() {
		super.addPagesListener();

		this._settingsBtn.addEventListener('click', () => {
			Router.go('/settings', false);
		});

		if (this._profileSettingsBtn) {
			this._profileSettingsBtn.addEventListener('click', () => {
				Router.go('/settings', false);
			});
		}

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

		for (let i = 0; i < this._likePosts.length; i++) {
			this._likePosts[i].addEventListener('click', () => {
				const postId = this._likePosts[i].getAttribute("data-id");
				actionPost.likePost(Number(postId));
			});
		}

		for (let i = 0; i < this._dislikePosts.length; i++) {
			this._dislikePosts[i].addEventListener('click', () => {
				const postId = this._dislikePosts[i].getAttribute("data-id");
				actionPost.dislikePost(Number(postId));
			});
		}

		this._createPosts.addEventListener('click', () => {
			localStorage.removeItem('groupLink');
			Router.go('/createPost', false);
		});

		if (this._goMsg) {
			this._goMsg.addEventListener('click', () => {
				const userId = this._goMsg.getAttribute("data-id");
				actionMessage.chatCheck(userId, () => {
					if (localStorage.getItem('chatFriendId')) {
						localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
						Router.go('/chat', false);
						actionMessage.getChatsMsg(localStorage.getItem('chatId'), 15);
					} else {
						actionMessage.chatCreate(userId, () => {
							if (localStorage.getItem('chatId')) {
								Router.go('/chat', false);
								actionMessage.getChatsMsg(localStorage.getItem('chatId'), 15);
							}
						});
					}
				});
			});
		}

		for (let i = 0; i < this._posts.length; i++) {
			const text = this._posts[i].textContent
			if (text.split('\n').length > maxTextStrings || text.length > maxTextLength) {
				const post = this._posts[i];
				let shortText;

				if (text.length > maxTextLength) {
					shortText = text.slice(0, maxTextLength) + '...';
				} else {
					const ind = text.indexOf('\n', text.indexOf('\n', text.indexOf('\n') + 1) + 1);
					shortText = text.slice(0, ind) + '...';
				}
				post.textContent = shortText;

				const openButton = document.createElement('div');
				openButton.textContent = 'Показать еще';
				openButton.style.color = '#9747FF';
				openButton.style.cursor = 'pointer';

				post.appendChild(openButton);
				openButton.addEventListener('click', function() {
					post.textContent = text;
				});
			}
		}
	}

	showPage(search) {
		if (search.link) {
			this._userLink = search.link;
			actionUser.getProfile(() => { actionPost.getPostsByUser(this._userLink, 15); }, this._userLink);
		} else {
			actionUser.getProfile(() => { this._userLink = userStore.user.user_link; Router.go('/user?link=' + userStore.user.user_link, true); });
		}

		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.profile;
		userStore.userProfile.isMyPage = true;
		if (this._userLink === userStore.user.user_link || this._userLink == null) {
			userStore.userProfile = userStore.user;
		} else {
			userStore.userProfile.isMyPage = false;
		}

		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			profileData: userStore.userProfile,
			postAreaData: {createPostData: {avatar_url: userStore.userProfile.avatar_url, jsId: 'js-create-post'}, postList: postsStore.posts},
		}
	}
}
