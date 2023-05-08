import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, maxTextStrings, maxTextLength} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";
import BaseView from "./baseView.js";

export default class FeedView extends BaseView {
	constructor() {
		super();

		this._jsId = 'feed';
		this.curPage = false;
	}

	addStore() {
		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');
		this._createPosts = document.getElementById('js-create-post');
		this._posts = document.getElementsByClassName('post-text');
	}

	addPagesListener() {
		super.addPagesListener();

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

	showPage() {
		actionUser.getProfile(() => { actionPost.getFriendsPosts(15); });
	}

	_preRender() {
		this._template = Handlebars.templates.feed;
		console.log(postsStore.friendsPosts)
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData: {createPostData: {avatar_url: userStore.user.avatar_url, jsId: 'js-create-post'}, postList: postsStore.friendsPosts},
		}
	}
}
