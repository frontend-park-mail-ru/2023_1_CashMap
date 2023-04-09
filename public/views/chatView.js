import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessages} from "../actions/actionMessages.js";
import messagesStore from "../stores/messagesStore.js";

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
		this._msgItem.style.color = activeColor;
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		})

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

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

		const template = Handlebars.templates.chatPage;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {
				id: 1,
				friendPhoto: 'static/img/post_icons/profile_image.svg',
				firstName: 'Карина',
				lastName: 'Анохина',
				messages: [ {
                    id: 1,
                    friendPhoto: 'static/img/post_icons/user_photo.svg',
                    text: 'Привет) Как дела?',
                    time: '13:30'
                },
                {
                    id: 2,
                    friendPhoto: 'static/img/post_icons/profile_image.svg',
                    text: 'Привет, хорошо. У тебя как? Чем занимаешься?',
                    time: '13:31'
                },
                {
                    id: 3,
                    friendPhoto: 'static/img/post_icons/user_photo.svg',
                    text: 'У меня супер! делаю проект....',
                    time: '13:35'
                }]
			}
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
