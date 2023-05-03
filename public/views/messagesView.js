import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";

export default class MessagesView extends BaseView {
	constructor() {
		super();
		this._addHandlebarsPartial();

		this._jsId = 'messages';
		this.curPage = false;

		messagesStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('search', Handlebars.templates.search)
		Handlebars.registerPartial('message', Handlebars.templates.message)
	}

	_addPagesElements() {
		super.addPagesElements();
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._feedBtn = document.getElementById('js-logo-go-feed');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._msgItem.style.color = activeColor;
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._goToMsg = document.getElementsByClassName('js-go-chat');
	}

	_addPagesListener() {
		super.addPagesListener();
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._groupsItem.addEventListener('click', () => {
            Router.go('/groups', false);
        });

		this._settingsBtn.addEventListener('click', () => {
			Router.go('/settings', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/user', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		this._feedBtn.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const chatId = this._goToMsg[i].getAttribute("data-id");
				localStorage.setItem('chatId', chatId);
				actionMessage.getChatsMsg(chatId,15);
				Router.go('/chat', false);
			});
		}
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		actionUser.getProfile(() => { actionMessage.getChats(15); });
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
		this._template = Handlebars.templates.messages;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		console.log(messagesStore.chats)
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			textInfo: {
				textInfo: 'У вас пока нет чатов',
			},
			messagesData: messagesStore.chats,
		}
		console.log(this._context)
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}
}
