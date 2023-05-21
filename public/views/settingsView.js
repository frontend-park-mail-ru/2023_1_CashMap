import userStore from "../stores/userStore.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, settingsConst, activeColor, signInData, optionsAvatar} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionImg} from "../actions/actionImg.js";
import BaseView from "./baseView.js";

export default class SettingsView extends BaseView {
	constructor() {
		super();

		this._jsId = 'settings';
		this.curPage = false;

		this._validateFirstName = true;
		this._validateLastName = true;
		this._validateStatus = true;
		this._validateBio = true;
		this._validateBirthday = true;

		this._reader = new FileReader();

		this._fileList = null;
	}

	addStore() {
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._settingsBtn = document.getElementById('js-menu-main');
		this._safetyBtn = document.getElementById('js-menu-safety');
		this._settingsBtn.style.color = activeColor;

		this._input = document.getElementById('js-select-file');
		this._input.setAttribute('accept', optionsAvatar.join(','));

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
		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._saveInfo = document.getElementById('js-save-info');

		this._error = document.getElementById('js-sign-in-error');
	}

	addPagesListener() {
		super.addPagesListener();

		this._safetyBtn.addEventListener('click', () => {
			Router.go('/safety', false);
		});

		this._dropZone.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		this._dropZone.addEventListener('drop', (event) => {
			event.preventDefault();

			this._fileList = event.dataTransfer.files[0];

			this._dropContent.innerHTML = '';
			this._reader.readAsDataURL(this._fileList);
			this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			});
		});

		this._dropZone.addEventListener('click', () => {
			this._input.click();
		});

		this._input.addEventListener('change', (event) => {
			if (!event.target.files.length) {
				return;
			}

			this._fileList = Array.from(event.target.files);
			this._fileList = this._fileList[0];

			this._dropContent.innerHTML = '';
			this._reader.readAsDataURL(this._fileList);
			this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			});
		});

		this._saveBtn.addEventListener('click', () => {
			if (this._validateFirstName && this._validateLastName && this._validateStatus && this._validateBio && this._validateBirthday) {
				this._error.textContent = '';
				this._error.classList.remove('display-inline-grid');
				this._error.classList.remove('font-color-error');
				this._error.classList.add('display-none');

				let birthday;
				if (this._birthdayField.value) {
					birthday = new Date(this._birthdayField.value).toISOString();
				}
				if (this._fileList) {
					actionImg.uploadImg(this._fileList, (newUrl) => {
						actionUser.editProfile({avatar_url: newUrl, firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value, birthday: birthday, status: this._statusField.value});
					});
				} else {
					console.log();
					actionUser.editProfile({firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value,  birthday: birthday, status: this._statusField.value});
				}
			} else {
				this._error.textContent = 'Заполните корректно все поля';
				this._error.classList.add('display-inline-grid');
				this._error.classList.add('font-color-error');
				this._error.classList.remove('font-color-ok');
				this._error.classList.remove('display-none');
			}
		});

		this._firstNameField.addEventListener('change', () => {
			this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName', 'settings');
		});
		this._lastNameField.addEventListener('change', () => {
			this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName', 'settings');
		});
		this._statusField.addEventListener('change', () => {
			this._validateStatus = Validation.validation(this._statusField, this._statusErrorField, 'userStatus', 'settings');
		});
		this._bioField.addEventListener('change', () => {
			this._validateBio = Validation.validation(this._bioField, this._bioErrorField, 'bio', 'settings');
		});
		this._birthdayField.addEventListener('change', () => {
			this._validateBirthday = Validation.validation(this._birthdayField, this._birthdayErrorField, 'birthday', 'settings');
		});
	}

	showPage() {
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.settings;

		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let settings = settingsConst;
		settings['avatar_url'] = userStore.user.avatar_url;
		settings['inputFields'][0]['data'] = userStore.user.firstName;
		settings['inputFields'][1]['data'] = userStore.user.lastName;
		settings['inputFields'][2]['data'] = userStore.user.bio;
		if (userStore.user.birthday) {
			settings['inputFields'][3]['data'] = userStore.user.birthday.substr(0, 10);
		} else {
			settings['inputFields'][3]['data'] = 'Дата не указана';
		}
		settings['inputFields'][4]['data'] = userStore.user.status;

		if (userStore.editStatus && userStore.editMsg) {
			settingsConst.errorInfo['errorText'] = userStore.editMsg;
			settingsConst.errorInfo['errorClass'] = 'display-inline-grid font-color-ok';
		} else if (!userStore.editStatus && userStore.editMsg) {
			settingsConst.errorInfo['errorText'] = userStore.editMsg;
			settingsConst.errorInfo['errorClass'] = 'display-inline-grid font-color-error';
		} else {
			settingsConst.errorInfo['errorText'] = '';
			settingsConst.errorInfo['errorClass'] = 'display-none';
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settingsConst,
		}
	}
}
