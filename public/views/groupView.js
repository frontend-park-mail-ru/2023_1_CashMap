import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, maxTextStrings, maxTextLength } from "../static/htmlConst.js";
import {actionPost} from "../actions/actionPost.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import { actionGroups } from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";

export default class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'group';
		this._groupLink = null;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._groupSettingsBtn = document.getElementById('js-group-settings-btn');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
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

		this._createPosts.addEventListener('click', () => {
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

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			alert(this._groupLink);
			actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, 15); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink);
		} else {
			Router.go('/groups', false);
		}
	}

	_preRender() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore.curGroup,
			postAreaData: {createPostData: {avatar: groupsStore.curGroup.avatar, jsId: 'js-create-post'}, postList: postsStore.posts},
		}
	}
}
