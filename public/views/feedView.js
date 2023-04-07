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
		this.init = false;

		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePageProfile.bind(this));
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

	/*{text: 'Моя страница', jsId: 'js-side-bar-my-page', iconPath: 'static/img/nav_icons/profile.svg', hoveredIconPath: 'static/img/nav_icons/profile_hover.svg', notifies: 1},
        {text: 'Новости', jsId: 'js-side-bar-news', iconPath: 'static/img/nav_icons/news.svg', hoveredIconPath: 'static/img/nav_icons/news_hover.svg', notifies: 0},
        {text: 'Мессенджер', jsId: 'js-side-bar-msg', iconPath: 'static/img/nav_icons/messenger.svg', hoveredIconPath: 'static/img/nav_icons/messenger_hover.svg', notifies: 7},
        {text: 'Фотографии', jsId: 'js-side-bar-photo', iconPath: 'static/img/nav_icons/photos.svg', hoveredIconPath: 'static/img/nav_icons/photos_hover.svg', notifies: 0},
        {text: 'Друзья', jsId: 'js-side-bar-friends', iconPath: 'static/img/nav_icons/friends.svg', hoveredIconPath: 'static/img/nav_icons/friends_hover.svg', notifies: 0},
        {text: 'Сообщества', jsId: 'js-side-bar-groups', iconPath: 'static/img/nav_icons/groups.svg', hoveredIconPath: 'static/img/nav_icons/groups_hover.svg', notifies: 0},
        {text: 'Закладки', jsId: 'js-side-bar-bookmarks', i*/

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		})

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends');
		})

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		})

		window.onload = function() {
			actionUser.getProfile();
			actionPost.getPostsByUser(userStore.user.user_link, 10);
		}
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				if (this.init === false) {
					actionUser.getProfile();
				}
				this._render();
			}
		}
	}

	updatePageProfile() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				actionPost.getPostsByUser(userStore.user.user_link, 10);
			}
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

		this.init = true;
	}

}
