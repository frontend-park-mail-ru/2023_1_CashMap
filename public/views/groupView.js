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
		this.isCreate = false;
		this.isEdit = false;
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
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._posts = document.getElementsByClassName('post-text');

		this._createPosts = document.getElementById('js-create-post');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');

		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

		this._text = document.getElementById('js-edit-post-textarea');
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		if (this._text) {
			this._text.focus();

			this._editBtn = document.getElementById('js-edit-post-btn');
			let textarea = document.getElementsByTagName('textarea');

			textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
			textarea[0].addEventListener("input", OnInput, false);
		}
	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
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

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				this.isEdit = this._editPosts[i].getAttribute("data-id");
				this.isCreate = false;
				actionPost.getPostsById(this.isEdit, 1);
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				this.isCreate = true;
				this.isEdit = false;
				super.render();
				this._text.focus();
			});
		}

		if (this._editBtn) {
			this._editBtn.addEventListener('click', () => {
				actionPost.editPost(this._text.value, this.isEdit);
				this.isEdit = false;
			});
		}

		if (this._createBtn) {
			this._createBtn.addEventListener('click', () => {
				actionPost.createPostCommunity(userStore.user.user_link, this._groupLink, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				super.render();
			});
		}

	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, 15); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink); });
		} else {
			Router.go('/groups', false);
		}
	}

	_preRender() {
		this._template = Handlebars.templates.group;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore.curGroup,
			postAreaData: {
				createPostData: {
					displayNone: !groupsStore.curGroup.isAdmin,
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: groupsStore.curGroup.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: groupsStore.curGroup.avatar_url, text: '', buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, buttonData1: { text: 'Отменить', jsId: 'js-back-post-btn' },}
				},
				postList: postsStore.groupsPosts},
		}

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore.curPost.id;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
}
