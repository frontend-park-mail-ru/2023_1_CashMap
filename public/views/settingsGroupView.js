import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, settingsGroupConst, activeColor, settingsConst } from "../static/htmlConst.js";
import {actionGroups} from "../actions/actionGroups.js";
import {actionImg} from "../actions/actionImg.js";
import groupsStore from "../stores/groupsStore.js";
import BaseView from "./baseView.js";
import Validation from "../modules/validation.js";
import { actionUser } from "../actions/actionUser.js";

export default class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'settingsGroup';

		this._groupLink = null;
		this._validateTitle = true;
		this._validateInfo = true;
		this._reader = new FileReader();

		this._fileList = null;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._dropArea = document.getElementById('js-drop-zone');
		this._dropContent = document.getElementById('js-drop-content');
		this._titleField = document.getElementById('js-title-input');
		this._titleErrorField = document.getElementById('js-title-error');
		this._infoField = document.getElementById('js-info-input');
		this._infoErrorField = document.getElementById('js-info-error');
		this._typeField = document.getElementById('js-type-input');
		this._showAuthorField = document.getElementById('js-showAuthor-input');
		this._saveBtn = document.getElementById('js-settings-save-btn');

		this._settingsBtn = document.getElementById('js-menu-main');
		this._settingsBtn.style.color = activeColor;
		this._subBtn = document.getElementById('js-menu-subscribers');
		this._requestsBtn = document.getElementById('js-menu-requests');

		this._deleteGroup = document.getElementById('js-group-delete-btn');

		this._error = document.getElementById('js-sign-in-error');
	}

	addPagesListener() {
		super.addPagesListener();

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
			let privacy = null;
			if (this._typeField.value === 'Закрытая группа') {
				privacy = 'close';
			} else {
				privacy = 'open';
			}
			if (this._validateTitle && this._validateInfo) {
				this._error.textContent = '';
				this._error.classList.remove('display-inline-grid');
				this._error.classList.remove('font-color-error');
				this._error.classList.add('display-none');

				if (this._fileList) {
					actionImg.uploadImg(this._fileList, (newUrl) => {
						actionGroups.editGroup({link: this._groupLink, avatar: newUrl, title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._showAuthorField.checked});
					});
				} else {
					actionGroups.editGroup({link: this._groupLink, title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._showAuthorField.checked});
				}
			} else {
				this._error.textContent = 'Заполните корректно все поля';
				this._error.classList.add('display-inline-grid');
				this._error.classList.add('font-color-error');
				this._error.classList.remove('font-color-ok');
				this._error.classList.remove('display-none');
			}
		});

		this._deleteGroup.addEventListener('click', () => {
			actionGroups.deleteGroup(this._groupLink);
			Router.go('/manageGroups', false);
		});

		this._titleField.addEventListener('change', () => {
			this._validateTitle = Validation.validation(this._titleField, this._titleErrorField, 'userStatus', 'settings');
		});

		this._infoField.addEventListener('change', () => {
			this._validateInfo = Validation.validation(this._infoField, this._infoErrorField, 'bio', 'settings');
		});
		
	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(null, this._groupLink); });
		} else {
			Router.goBack();
		}
	}

	_preRender() {
		this._template = Handlebars.templates.settingsGroup;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let settings = settingsGroupConst;
		settings['avatar_url'] = groupsStore.curGroup.avatar_url;
		settings['inputInfo']['data'] = groupsStore.curGroup.title;
		settings['info'] = groupsStore.curGroup.info;
		if (groupsStore.curGroup.privacy === 'open') {
			settings['type'] = true;
		} else {
			settings['type'] = false;
		}
		settings['showAuthor'] = groupsStore.curGroup.hideOwner;

		if (groupsStore.editStatus && groupsStore.editMsg) {
			settings.errorInfo['errorText'] = groupsStore.editMsg;
			settings.errorInfo['errorClass'] = 'display-inline-grid font-color-ok';
		} else if (!groupsStore.editStatus && groupsStore.editMsg) {
			settings.errorInfo['errorText'] = groupsStore.editMsg;
			settings.errorInfo['errorClass'] = 'display-inline-grid font-color-error';
		} else {
			settings.errorInfo['errorText'] = '';
			settings.errorInfo['errorClass'] = 'display-none';
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settings,
		}
	}
}
