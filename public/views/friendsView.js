import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, friendsMenuInfo, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionFriends} from "../actions/actionFriends.js";
import friendsStore from "../stores/friendsStore.js";
import {actionMessage} from "../actions/actionMessage.js";
import BaseView from "./baseView.js";

export default class FriendsView extends BaseView {
	constructor() {
		super();
		this._addHandlebarsPartial();

		this._jsId = 'friends';
		this.curPage = false;

		friendsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('search', Handlebars.templates.search)
		Handlebars.registerPartial('friend', Handlebars.templates.friend)
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._friendsBtn = document.getElementById('js-menu-friends');
		this._subscribersBtn = document.getElementById('js-menu-subscribers');
		this._subscriptionsBtn = document.getElementById('js-menu-subscriptions');
		this._findFriendsBtn = document.getElementById('js-menu-find-friends');

		switch (window.location.pathname) {
			case '/friends':
				this._friendsBtn.style.color = activeColor;
				break;
			case '/subscribers':
				this._subscribersBtn.style.color = activeColor;
				break;
			case '/subscriptions':
				this._subscriptionsBtn.style.color = activeColor;
				break;
			case '/findFriends':
				this._findFriendsBtn.style.color = activeColor;
				break;
		}

		this._feedBtn = document.getElementById('js-logo-go-feed');
		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._friendsItem.style.color = activeColor;
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		this._goToProfile = document.getElementsByClassName('friend-menu-item-page');
		this._goToMsg = document.getElementsByClassName('js-friend-go-msg');
		this._deleteFriend = document.getElementsByClassName('friend-menu-item-delete');
		this._addUser = document.getElementsByClassName('js-friend-add');
		this._unsubUser = document.getElementsByClassName('js-friend-unsub');
		this._deleteUser = document.getElementsByClassName('js-friend-delete');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

		this._myPageItem.addEventListener('click', () => {
			Router.go('/user', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		this._friendsBtn.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._subscribersBtn.addEventListener('click', () => {
			this._subscribersBtn.style.color = activeColor;
			Router.go('/subscribers', false);
		});

		this._subscriptionsBtn.addEventListener('click', () => {
			this._subscriptionsBtn.style.color = activeColor;
			Router.go('/subscriptions', false);
		});

		this._findFriendsBtn.addEventListener('click', () => {
			this._findFriendsBtn.style.color = activeColor;
			Router.go('/findFriends', false);
		});

		this._feedBtn.addEventListener('click', () => {
            Router.go('/feed', false);
        });

		for (let i = 0; i < this._addUser.length; i++) {
			this._addUser[i].addEventListener('click', () => {
				const userId = this._addUser[i].getAttribute("data-id");
				actionFriends.sub(userId);
			});
		}

		for (let i = 0; i < this._deleteFriend.length; i++) {
			this._deleteFriend[i].addEventListener('click', () => {
				const userId = this._deleteFriend[i].getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		for (let i = 0; i < this._unsubUser.length; i++) {
			this._unsubUser[i].addEventListener('click', () => {
				const userId = this._unsubUser[i].getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		for (let i = 0; i < this._deleteUser.length; i++) {
			this._deleteUser[i].addEventListener('click', () => {
				const userId = this._deleteUser[i].getAttribute("data-id");
				actionFriends.reject(userId); //пока не работает
			});
		}

		for (let i = 0; i < this._goToProfile.length; i++) {
			this._goToProfile[i].addEventListener('click', () => {
				const userId = this._goToProfile[i].getAttribute("data-id");
				Router.go('/user?link=' + userId, false);
			});
		}

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const userId = this._goToMsg[i].getAttribute("data-id");
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
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		actionUser.getProfile(() => {
			actionFriends.getFriends(userStore.user.user_link, 15, 0);
			actionFriends.getNotFriends(15, 0);
			actionFriends.getSubscribers(userStore.user.user_link, 15);
			actionFriends.getSubscriptions(userStore.user.user_link, 15);
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
		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/friends':
				res = friendsStore.friends;
				info = 'У вас пока нет друзей';
				break;
			case '/subscribers':
				res = friendsStore.subscribers;
				info = 'у вас пока нет подписчиков'
				break;
			case '/subscriptions':
				res = friendsStore.subscriptions;
				info = 'у вас пока нет подписок'
				break;
			case '/findFriends':
				res = friendsStore.notFriends;
				break;
		}
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			friendsData: res,
			textInfo: {
				textInfo: info,
			},
			menuInfo: friendsMenuInfo,
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}

}
