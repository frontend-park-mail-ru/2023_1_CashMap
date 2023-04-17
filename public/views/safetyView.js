import userStore from "../stores/userStore.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, safetyConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";

export default class SafetyView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'safety';
		this.curPage = false;

		this._validatePassword = true;
		this._validatePasswordNew = false;
        this._validatePasswordRepeat = true;

		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._settingsBtn = document.getElementById('js-menu-main');
		this._safetyBtn = document.getElementById('js-menu-safety');
		this._safetyBtn.style.color = activeColor;

		this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
		this._passwordNewField = document.getElementById('js-new-password-input');
        this._passwordNewErrorField = document.getElementById('js-new-password-error');
        this._passwordRepeatField = document.getElementById('js-repeat-password-input');
        this._passwordRepeatErrorField = document.getElementById('js-repeat-password-error');
		this._saveBtn = document.getElementById('js-change-password-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
		this._saveInfo = document.getElementById('js-save-password-info');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		})

		this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

		this._safetyBtn.addEventListener('click', () => {
            Router.go('/safety', false);
        });

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends');
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/myPage');
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		});

		this._saveBtn.addEventListener('click', () => {
			if (this._validatePassword && this._validatePasswordNew && this._validatePasswordRepeat) {
                actionUser.editProfile({password: this._passwordNewField.value});
				this._saveInfo.textContent = 'Изменения сохранены';
			}
		});

		this._passwordField.addEventListener('change', () => {
			//todo: проверить, что ввели верный пароль действующий
        });

		this._passwordNewField.addEventListener('change', () => {
            this._validatePasswordNew = Validation.validation(this._passwordNewField, this._passwordNewErrorField, 'password');
        });

        this._passwordRepeatField.addEventListener('change', () => {
            //this._validatePasswordRepeat = Validation.validation(this._passwordRepeatField, this._passwordRepeatErrorField, 'secondPassword');
        });
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
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.safety;

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			safetyPathData: safetyConst,
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}

}
