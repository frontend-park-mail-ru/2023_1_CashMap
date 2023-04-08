import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessages} from "../actions/actionMessages.js";
import messagesStore from "../stores/messagesStore.js";

export default class MessagesView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'messages';
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
		Handlebars.registerPartial('search', Handlebars.templates.search)
		Handlebars.registerPartial('message', Handlebars.templates.message)
	}

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

		this._myPageItem.addEventListener('click', () => {
			Router.go('/profile');
		})

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		})
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
					actionMessages.getMessages(userStore.user.user_link, 15, 0);
				}
				this._render();
			}
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.messages;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			messagesData: messagesStore.messages,
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
