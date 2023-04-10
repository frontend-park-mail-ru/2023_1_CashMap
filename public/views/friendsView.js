import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionFriends} from "../actions/actionFriends.js";
import friendsStore from "../stores/friendsStore.js";
import {actionPost} from "../actions/actionPost.js";
import {actionMessage} from "../actions/actionMessage.js";

export default class FriendsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'friends';
		this.curPage = false;
		this.init = false;

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
		this._deleteUser = document.getElementsByClassName('friend-menu-item-delete');
		this._addUser = document.getElementsByClassName('js-friend-add');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

		this._myPageItem.addEventListener('click', () => {
			Router.go('/myPage', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		for (let i = 0; i < this._addUser.length; i++) {
			this._addUser[i].addEventListener('click', () => {
				const userId = this._addUser[i].getAttribute("data-id");
				actionFriends.sub(userId);
			});
		}

		for (let i = 0; i < this._deleteUser.length; i++) {
			this._deleteUser[i].addEventListener('click', () => {
				const userId = this._deleteUser[i].getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		for (let i = 0; i < this._goToProfile.length; i++) {
			this._deleteUser[i].addEventListener('click', () => {
				const userId = this._deleteUser[i].getAttribute("data-id");
				// ToDo: переход в профиль пользователя userId
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
		this.init = true;
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
		const res = [...friendsStore.friends, ...friendsStore.notFriends, ...friendsStore.subscribers, ...friendsStore.subscriptions];

		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			friendsData: res,
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}

}
