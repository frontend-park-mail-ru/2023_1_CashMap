import userStore from "../stores/userStore.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, settingsConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionImg} from "../actions/actionImg.js";
import imgStore from "../stores/imgStore.js";

export default class SettingsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'settings';
		this.curPage = false;

		this._validateFirstName = true;
		this._validateLastName = true;
		this._validateEmail = true;

		userStore.registerCallback(this.updatePage.bind(this));
		this._reader = new FileReader();

		this._fileList = null;
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
		this._settingsBtn = document.getElementById('js-menu-main');
		this._safetyBtn = document.getElementById('js-menu-safety');
		this._settingsBtn.style.color = activeColor;

		this._dropZone = document.getElementById('js-drop-zone');
		this._dropContent = document.getElementById('js-drop-content');
		this._firstNameField = document.getElementById('js-first-name-input');
		this._firstNameErrorField = document.getElementById('js-first-name-error');
		this._lastNameField = document.getElementById('js-last-name-input');
		this._lastNameErrorField = document.getElementById('js-last-name-error');
		this._bioField = document.getElementById('js-bio-input');
		this._bioErrorField = document.getElementById('js-bio-error');
		this._birthdayField = document.getElementById('js-birthday-input');
		this._birthdayErrorField = document.getElementById('js-birthday-error');
		this._statusField = document.getElementById('js-status-input');
		this._statusErrorField = document.getElementById('js-status-error');
		this._saveBtn = document.getElementById('js-settings-save-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
		this._saveInfo = document.getElementById('js-save-info');
    
     	this._dropArea = document.getElementById('js-drop-zone');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
			Router.go('/settings', false);
		});

		this._safetyBtn.addEventListener('click', () => {
			Router.go('/safety', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends');
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/myPage');
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		})

		this._dropArea.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		this._dropArea.addEventListener('drop', (event) => {
			event.preventDefault();

			this._fileList = event.dataTransfer.files[0];

			this._dropContent.innerHTML = '';
			this._reader.readAsDataURL(this._fileList);
			this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			});
		});

		this._saveBtn.addEventListener('click', () => {
			if (this._validateFirstName && this._validateLastName && this._validateEmail) {
				let birthday;
				if (this._birthdayField.value) {
					console.log(this._birthdayField.value);
					console.log(typeof(this._birthdayField.value));

					birthday = new Date(this._birthdayField.value).toISOString();
	
					console.log(birthday);
				}
				if (this._fileList) {
					actionImg.uploadImg(this._fileList, (newUrl) => {
						actionUser.editProfile({avatar: newUrl, firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value, birthday: birthday, status: this._statusField.value});
					});
				} else {
					actionUser.editProfile({firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value,  birthday: birthday, status: this._statusField.value});
				}
			}
		});

		this._firstNameField.addEventListener('change', (e) => {
			this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName');
		});
		this._lastNameField.addEventListener('change', (e) => {
			this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName');
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
		this._template = Handlebars.templates.settings;

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		let settings = settingsConst;
		settings['avatar'] = userStore.user.avatar;
		settings['inputFields'][0]['data'] = userStore.user.firstName;
		settings['inputFields'][1]['data'] = userStore.user.lastName;
		settings['inputFields'][2]['data'] = userStore.user.bio;
		if (userStore.user.birthday) {
			settings['inputFields'][3]['data'] = userStore.user.birthday.substr(0, 10);
		} else {
			settings['inputFields'][3]['data'] = 'Дата не указана';
		}
		settings['inputFields'][4]['data'] = userStore.user.status;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settingsConst,
		}
	}

	_render() {
		this._preRender();
		Router.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}

}
