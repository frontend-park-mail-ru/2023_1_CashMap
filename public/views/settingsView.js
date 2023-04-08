import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, settingsConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";

export default class SettingsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'settings';
		this.curPage = false;
        this.init = false;

		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('inputSettings', Handlebars.templates.inputSettings)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('settingsPath', Handlebars.templates.settingsPath)
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
				this._render();
			}
		}
	}

	showPage() {
		if (userStore.user.isAuth === false) {
			console.log(userStore.user.isAuth);
			Router.go('/signIn');
		} else {
			actionUser.getProfile();
			this._render();
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		let settings = settingsConst;
		console.log(userStore.user.firstName);
		settings['avatar'] = userStore.user.avatar;
		settings['inputFields'][0]['data'] = userStore.user.firstName;
		settings['inputFields'][1]['data'] = userStore.user.lastName;
		settings['inputFields'][2]['data'] = userStore.user.email; // этого немного нет в сторе((
		settings['inputFields'][3]['data'] = userStore.user.city; // этого тоже нет 
		settings['inputFields'][4]['data'] = userStore.user.birthday;
		settings['inputFields'][5]['data'] = userStore.user.status;

		const template = Handlebars.templates.settings;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settingsConst,
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
