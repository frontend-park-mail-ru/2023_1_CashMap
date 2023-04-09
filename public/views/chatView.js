import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import {actionPost} from "../actions/actionPost.js";

export default class ChatView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'chat-page';
		this.curPage = false;
		this.init = false;

		messagesStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('chat', Handlebars.templates.chat)
		Handlebars.registerPartial('chatItem', Handlebars.templates.chatItem)
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		this._sendMsg = document.getElementById('js-send-msg');
		this._msg = document.getElementById('js-msg-input');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends');
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/profile');
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		});

		this._sendMsg.addEventListener('click', () => {
			actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
		});
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		this.init = true;
		const chatId = localStorage.getItem('chatId');
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,15); });
		} else {
			Router.goBack();
		}
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
		this._template = Handlebars.templates.chatPage;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {messages: messagesStore.messages, user: userStore.user, chat: localStorage.getItem('chatId')},
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}
}
