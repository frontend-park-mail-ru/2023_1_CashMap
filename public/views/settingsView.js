import userStore from "../stores/userStore.js";
import Validation from "../modules/validation.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, settingsConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";

export default class SettingsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'settings';
		this.curPage = false;
        this.init = false;

		this._validateFirstName = true;
        this._validateLastName = true;
        this._validateEmail = true;

		userStore.registerCallback(this.updatePage.bind(this));
		this._reader = new FileReader();
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
        this._emailField = document.getElementById('js-email-input');
        this._emailErrorField = document.getElementById('js-email-error');
		this._cityField = document.getElementById('js-city-input');
        this._cityErrorField = document.getElementById('js-city-error');
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

		if (window.FileList && window.File) {
			this._dropZone.addEventListener('dragover', event => {
			  event.stopPropagation();
			  event.preventDefault();
			  event.dataTransfer.dropEffect = 'copy';
			});
			
			this._dropZone.addEventListener('drop', event => {
			  this._dropContent.innerHTML = '';
			  event.stopPropagation();
			  event.preventDefault();
			  const files = event.dataTransfer.files;
			  console.log(files);
			  
			  this._reader.readAsDataURL(files[0]);
			
			  this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			  });
			}); 
		}

		this._saveBtn.addEventListener('click', () => {
			if (this._validateFirstName && this._validateLastName && this._validateEmail) {
                actionUser.editProfile({avatar: this._dropContent.src, firstName: this._firstNameField.value, lastName: this._lastNameField.value, email: this._emailField.value, city: this._cityField.value, status: this._statusField.value});
			}
		});

		this._firstNameField.addEventListener('change', (e) => {
            this._validateFirstName = Validation.validation(this._firstNameField, this._firstNameErrorField, 'firstName');
        });
        this._lastNameField.addEventListener('change', (e) => {
            this._validateLastName = Validation.validation(this._lastNameField, this._lastNameErrorField, 'lastName');
        });
        this._emailField.addEventListener('change', (e) => {
            this._validateEmail = Validation.validation(this._emailField, this._emailErrorField, 'email');
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
		this.init = true;
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.settings;

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		let settings = settingsConst;
		console.log(userStore.user.firstName);
		settings['avatar'] = userStore.user.avatar;
		settings['inputFields'][0]['data'] = userStore.user.firstName;
		settings['inputFields'][1]['data'] = userStore.user.lastName;
		settings['inputFields'][2]['data'] = userStore.user.email;
		settings['inputFields'][3]['data'] = userStore.user.city; // этого нет в сторе
		settings['inputFields'][4]['data'] = userStore.user.birthday;
		settings['inputFields'][5]['data'] = userStore.user.status;

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
