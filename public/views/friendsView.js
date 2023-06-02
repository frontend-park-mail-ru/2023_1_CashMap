import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, friendsMenuInfo, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionFriends} from "../actions/actionFriends.js";
import friendsStore from "../stores/friendsStore.js";
import searchStore from "../stores/dropdownSearchStore.js";
import {actionMessage} from "../actions/actionMessage.js";
import BaseView from "./baseView.js";
import {actionSearch} from "../actions/actionSearch.js";
import postsStore from "../stores/postsStore.js";
import {actionPost} from "../actions/actionPost.js";
import router from "../modules/router.js";


export default class FriendsView extends BaseView {
	constructor() {
		super();
		this._addHandlebarsPartial();

		this._jsId = 'friends';
		this.curPage = false;

		this._friendsBatchSize = 15;

		friendsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
		searchStore.registerCallback(this.updateSearchList.bind(this))
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
		super.addPagesElements()

		this._friendsItem.style.color = activeColor;
		this._friendsImg.style.display = "none";
		this._friendsImgActive.style.display = "inline-block";

		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._feedBtn = document.getElementById('js-logo-go-feed');
		this._friendsBtn = document.getElementById('js-menu-friends');
		this._subscribersBtn = document.getElementById('js-menu-subscribers');
		this._subscriptionsBtn = document.getElementById('js-menu-subscriptions');
		this._findFriendsBtn = document.getElementById('js-menu-find-friends');
		this._profile = document.getElementsByClassName("friend__info");


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
			case '/find-friends':
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

		this._goToMsg = document.getElementsByClassName('js-friend-go-msg');
		this._deleteFriend = document.getElementsByClassName('friend-menu-item-delete');
		this._addUser = document.getElementsByClassName('js-friend-add');
		this._unsubUser = document.getElementsByClassName('js-friend-unsub');
		this._deleteUser = document.getElementsByClassName('js-friend-delete');

		this._usersList = document.getElementById("js-users-list");
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
			Router.go('/find-friends', false);
		});

		this._feedBtn.addEventListener('click', () => {
            Router.go('/feed', false);
        });

		this._groupsItem.addEventListener('click', () => {
            Router.go('/groups', false);
        });

		for (let i = 0; i < this._addUser.length; i++) {
			this._addUser[i].addEventListener('click', () => {
				const userId = this._addUser[i].getAttribute("data-id");
				actionFriends.sub(userId);
				event.stopPropagation();
			});
		}

		for (let i = 0; i < this._deleteFriend.length; i++) {
			this._deleteFriend[i].addEventListener('click', () => {
				const userId = this._deleteFriend[i].getAttribute("data-id");
				actionFriends.unsub(userId);
				event.stopPropagation();
			});
		}

		for (let i = 0; i < this._unsubUser.length; i++) {
			this._unsubUser[i].addEventListener('click', () => {
				const userId = this._unsubUser[i].getAttribute("data-id");
				actionFriends.unsub(userId);
				event.stopPropagation();
			});
		}

		for (let i = 0; i < this._deleteUser.length; i++) {
			this._deleteUser[i].addEventListener('click', () => {
				const userId = this._deleteUser[i].getAttribute("data-id");
				actionFriends.reject(userId); //пока не работает
			});
		}

		for (let i = 0; i < this._profile.length; i++) {
			this._profile[i].addEventListener('click', () => {
				const userId = this._goToProfile[i].getAttribute("data-id");
				Router.go('/user?link=' + userId, false);
			});
		}

		window.onscroll = () => {
			if (scrollY + innerHeight  >= document.body.scrollHeight && !this.watingForNewItems) {
				let path = window.location.pathname;
				if (path === '/friends' && friendsStore.hasMoreFriends) {
					actionFriends.getFriends(userStore.user.user_link, this._friendsBatchSize, friendsStore.friends.length, true);
				} else if (path === '/subscribers' && friendsStore.hasMoreSubscribers) {
					actionFriends.getSubscribers(userStore.user.user_link, this._friendsBatchSize, friendsStore.subscribers.length, true);
				} else if (path === '/subscriptions' && friendsStore.hasMoreSubscriptions) {
					actionFriends.getSubscriptions(userStore.user.user_link, this._friendsBatchSize, friendsStore.subscriptions.length, true);
				} else if (path === '/find-friends' && friendsStore.hasMoreUsers) {
					if (this._searchAreaInput.value.trim() === "") {
						actionFriends.getNotFriends(this._friendsBatchSize, friendsStore.notFriends.length, true);
					} else {
						actionSearch.search(this._searchAreaInput.value.trim(), this._friendsBatchSize, searchStore.userSearchItems.length, true)
					}
				}

				this.watingForNewItems = true;
			}
		};

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const userId = this._goToMsg[i].getAttribute("data-id");
				actionMessage.chatCheck(userId, () => {
					if (localStorage.getItem('chatFriendId')) {
						localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
						Router.go('/chat', false);
						actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
					} else {
						actionMessage.chatCreate(userId, () => {
							if (localStorage.getItem('chatId')) {
								Router.go('/chat', false);
								actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
							}
						});
					}
				});
				event.stopPropagation();
			});
		}


		switch (window.location.pathname) {
			case '/find-friends':
				this._searchAreaInput.addEventListener('keyup', () => {
					if (this._searchAreaInput.value === "") {
						localStorage.removeItem("searchQuery");
						Router.go('/find-friends');
						return
					}
					this.interruptTimer();

					this.startTimer(250, () => {
						if (this._searchAreaInput.value !== "") {
							localStorage.setItem("searchQuery", this._searchAreaInput.value);
							actionSearch.search(this._searchAreaInput.value, this._friendsBatchSize);
						}
					})
				});
				break

		}
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		actionUser.getProfile(() => {
			actionFriends.getFriends(userStore.user.user_link, this._friendsBatchSize, 0);
			actionFriends.getNotFriends(this._friendsBatchSize, 0);
			actionFriends.getSubscribers(userStore.user.user_link, this._friendsBatchSize);
			actionFriends.getSubscriptions(userStore.user.user_link, this._friendsBatchSize);
		});
	}

	updateSearchList() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/sign-in');
			} else {
				this._renderNewSearchList();
			}
		}
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/sign-in');
			} else {
				this._render();
			}
		}
	}

	_renderNewSearchList() {
		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/find-friends':
				res = searchStore.userSearchItems;
				info = 'По данному запросу не найдено людей'
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

		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
		this._searchAreaInput.value = localStorage.getItem("searchQuery");
		this._searchAreaInput.focus();
	}

	_preRender() {
		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/friends':
				res = friendsStore.friends;
				document.title = 'Друзья';
				info = 'У вас пока нет друзей';
				break;
			case '/subscribers':
				res = friendsStore.subscribers;
				document.title = 'Подписчики';
				info = 'У вас пока нет подписчиков'
				break;
			case '/subscriptions':
				res = friendsStore.subscriptions;
				document.title = 'Подписки';
				info = 'У вас пока нет подписок'
				break;
			case '/find-friends':
				document.title = 'Поиск друзей';
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
		this.watingForNewItems = false;

		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();

		let query = localStorage.getItem("searchQuery");
		if (window.location.pathname === "/find-friends" && query != null && query.trim() !== "") {
			this._searchAreaInput.value = query;
			this._searchAreaInput.focus();
			actionSearch.search(this._searchAreaInput.value, this._friendsBatchSize);
		} else {
			localStorage.removeItem("searchQuery");
			this._searchAreaInput.focus();
		}
	}
}
