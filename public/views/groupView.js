import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, maxTextStrings, maxTextLength } from "../static/htmlConst.js";
import {actionPost} from "../actions/actionPost.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import { actionGroups } from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";
import { actionUser } from "../actions/actionUser.js";

export default class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'group';
		this._groupLink = null;

		this._postsBatchSize = 15;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
		postsStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._groupSettingsBtn = document.getElementById('js-group-settings-btn');
		this._groupSub = document.getElementById('js-group-sub-btn');
		this._groupUnsub = document.getElementById('js-group-unsub-btn');
		this._groupDelete = document.getElementById('js-group-delete-btn');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
		this._posts = document.getElementsByClassName('post-text');

		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

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

		window.addEventListener('scroll', () => {
			if (scrollY + innerHeight  >= document.body.scrollHeight && !this.watingForNewPosts && postsStore.hasMorePosts) {
				actionPost.getPostsByCommunity(this._groupLink, this._postsBatchSize, postsStore.groupsPosts.at(-1).raw_creation_date, true);
				this.watingForNewPosts = true;
			}
		});

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				localStorage.setItem('groupLink', this._groupLink);
				Router.go('/createPost', false);
			});
		}

		if (this._groupSub) {
			this._groupSub.addEventListener('click', () => {
				actionGroups.groupSub(this._groupLink);
			});
		}

		if (this._groupUnsub) {
			this._groupUnsub.addEventListener('click', () => {
				actionGroups.groupUnsub(this._groupLink);
			});
		}

		if (this._groupDelete) {
			this._groupDelete.addEventListener('click', () => {
				actionGroups.deleteGroup(this._groupLink);
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

		if (this._groupSettingsBtn) {
			this._groupSettingsBtn.addEventListener('click', () => {
				Router.go('/settingsGroup?link=' + this._groupLink, false);
			});
		}

	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, this._postsBatchSize); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink); });
		} else {
			Router.go('/groups', false);
		}
	}

	_preRender() {
		this.watingForNewPosts = false;

		this._template = Handlebars.templates.group;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore.curGroup,
			postAreaData: {createPostData: {displayNone: !groupsStore.curGroup.isAdmin, avatar_url: groupsStore.curGroup.avatar_url, jsId: 'js-create-post'}, postList: postsStore.groupsPosts},
		}
	}
}
