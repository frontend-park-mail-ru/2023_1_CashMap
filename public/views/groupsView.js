import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {
	sideBarConst,
	headerConst,
	groupsConst,
	NewGroupConst,
	activeColor,
	friendsMenuInfo
} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionGroups} from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";
import BaseView from "./baseView.js";
import {actionSearch} from "../actions/actionSearch.js";
import searchStore from "../stores/dropdownSearchStore.js";

export default class GroupsView extends BaseView {
	constructor() {
		super();
		this._jsId = 'groups';
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
		searchStore.registerCallback(this.updateSearchList.bind(this))
	}

	addPagesElements() {
		super.addPagesElements()

		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._groupsItem.style.color = activeColor;
		this._groupsBtn = document.getElementById('js-menu-groups');
		this._manageGroupsBtn = document.getElementById('js-menu-manage-groups');
		this._findGroupsBtn = document.getElementById('js-menu-find-groups');
		this._popularGroupsBtn = document.getElementById('js-menu-popular-groups');

		this._goToProfile = document.getElementsByClassName('js-go-to-profile');
		this._goToGroup = document.getElementsByClassName('js-go-to-group');

		switch (window.location.pathname) {
			case '/groups':
				this._groupsBtn.style.color = activeColor;
				break;
			case '/manageGroups':
				this._manageGroupsBtn.style.color = activeColor;
				break;
			case '/findGroups':
				this._findGroupsBtn.style.color = activeColor;
				break;
			case '/popularGroups':
				this._popularGroupsBtn.style.color = activeColor;
				break;
		}

		this._titleField = document.getElementById('js-title-input');
		this._titleErrorField = document.getElementById('js-title-error');
		this._infoField = document.getElementById('js-info-input');
		this._infoErrorField = document.getElementById('js-info-error');
		this._selectField = document.getElementById('js-select');
		this._checkboxField = document.getElementById('js-group-checkbox');
		this._addGroupBtn = document.getElementById('js-add-group-btn');

		this._unsubGroup = document.getElementsByClassName('groupItem-menu-item-delete');
	}

	addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
			Router.go('/settings', false);
		});

		this._groupsItem.addEventListener('click', () => {
			Router.go('/groups', false);
		});

		this._feedBtn.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router.go('/user', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends', false);
		});

		this._manageGroupsBtn.addEventListener('click', () => {
			this._manageGroupsBtn.style.color = activeColor;
			Router.go('/manageGroups', false);
		});

		this._findGroupsBtn.addEventListener('click', () => {
			this._findGroupsBtn.style.color = activeColor;
			Router.go('/findGroups', false);
		});

		this._popularGroupsBtn.addEventListener('click', () => {
			this._popularGroupsBtn.style.color = activeColor;
			Router.go('/popularGroups', false);
		});

		this._groupsBtn.addEventListener('click', () => {
			this._groupsBtn.style.color = activeColor;
			Router.go('/groups', false);
		})

		if (this._addGroupBtn !== null) {
			this._addGroupBtn.addEventListener('click', () => {
				let privacy;
				if (this._selectField.value == 'Открытая группа') {
					privacy = 'open';
				} else {
					privacy = 'close';
				}
				actionGroups.createGroup({title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._checkboxField.checked});
				Router.go('/manageGroups', false);
			});
		}

		for (let i = 0; i < this._goToGroup.length; i++) {
			this._goToGroup[i].addEventListener('click', () => {
				const groupId = this._goToGroup[i].getAttribute("data-id");
				Router.go('/group?link=' + groupId, false);
			});
		}

		switch (window.location.pathname) {
			case '/findGroups':
				this._searchAreaInput.addEventListener('keyup', () => {
					if (this._searchAreaInput.value === "") {
						localStorage.removeItem("searchQuery");
						Router.go('/findGroups');
						return
					}
					this.interruptTimer();

					this.startTimer(250, () => {
						if (this._searchAreaInput.value !== "") {
							localStorage.setItem("searchQuery", this._searchAreaInput.value);
							actionSearch.search(this._searchAreaInput.value);
						}
					})
				});
				break

		}
	}

	updateSearchList() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				this._renderNewSearchList();
			}
		}
	}

	_renderNewSearchList() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/findGroups':
				res = searchStore.communitySearchItems;
				info = 'По данному запросу не найдены сообщества'
				break;
		}
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			groupsData: res,
			textInfo: {
				textInfo: info,
			},
			groupsPathData: groupsConst,
			menuInfo: friendsMenuInfo,
		}

		Router.rootElement.innerHTML = this._template(this._context);
		this.addPagesElements();
		this.addPagesListener();
		this._searchAreaInput.value = localStorage.getItem("searchQuery");
		this._searchAreaInput.focus();
	}

	showPage() {
		actionUser.getProfile(() => {
			actionGroups.getGroups(15, 0);
			actionGroups.getmanageGroups(15, 0);
			actionGroups.getNotGroups(15, 0);
			//actionGroups.getPopularGroups(15, 0);
		});
	}

	_preRender() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/groups':
				res = groupsStore.groups;
				info = 'Вы не подписаны на сообщества';
				break;
			case '/manageGroups':
				res = groupsStore.manageGroups;
				info = 'У вас пока нет сообществ';
				break;
			case '/findGroups':
				res = groupsStore.findGroups;
                info = 'Сообщества не найдены';
				break;
			case '/popularGroups':
				res = groupsStore.popularGroups;
                info = 'Сообщества не найдены';
				break;
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			groupsData: res,
			textInfo: {
				textInfo: info,
			},
			groupsPathData: groupsConst,
			newGroupData: NewGroupConst,
		}
	}


	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				this.render();
				this._searchAreaInput.focus();
			}
		}
	}
}
