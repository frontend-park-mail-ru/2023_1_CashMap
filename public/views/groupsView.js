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
import friendsStore from "../stores/friendsStore.js";
import {actionFriends} from "../actions/actionFriends.js";
import {actionMessage} from "../actions/actionMessage";
import Notifies from "../modules/notifies";
import messagesStore from "../stores/messagesStore";

export default class GroupsView extends BaseView {
	constructor() {
		super();
		this._jsId = 'groups';

		this._groupsBatchSize = 15;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		messagesStore.registerCallback(this.updatePage.bind(this));
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
		searchStore.registerCallback(this.updateSearchList.bind(this))
	}

	addPagesElements() {
		super.addPagesElements()

		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._groupsItem.style.color = activeColor;
		this._groupsImg.style.display = "none";
		this._groupsImgActive.style.display = "inline-block";

		this._groupsBtn = document.getElementById('js-menu-groups');
		this._manageGroupsBtn = document.getElementById('js-menu-manage-groups');
		this._findGroupsBtn = document.getElementById('js-menu-find-groups');
		this._popularGroupsBtn = document.getElementById('js-menu-popular-groups');

		this._goToProfile = document.getElementsByClassName('js-go-to-profile');
		this._goToGroup = document.getElementsByClassName('js-go-to-group');

		this.newGroupWindow = document.getElementById("newGroup");

		switch (window.location.pathname) {
			case '/groups':
				this._groupsBtn.style.color = activeColor;
				break;
			case '/manage-groups':
				this._manageGroupsBtn.style.color = activeColor;
				break;
			case '/find-groups':
				this._findGroupsBtn.style.color = activeColor;
				break;
			case '/popular-groups':
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
			Router.go('/manage-groups', false);
		});

		this._findGroupsBtn.addEventListener('click', () => {
			this._findGroupsBtn.style.color = activeColor;
			Router.go('/find-groups', false);
		});

		/*this._popularGroupsBtn.addEventListener('click', () => {
			this._popularGroupsBtn.style.color = activeColor;
			Router.go('/popular-groups', false);
		});*/

		this._groupsBtn.addEventListener('click', () => {
			this._groupsBtn.style.color = activeColor;
			Router.go('/groups', false);
		})

		this.newGroupWindow.addEventListener('click', () => {
			let errField = document.getElementById(NewGroupConst.inputInfo.jsIdError);
			errField.textContent = "";
		}, true);

		window.onscroll = () => {
			if (scrollY + innerHeight  >= document.body.scrollHeight && !this.watingForNewItems) {
				let path = window.location.pathname;
				if (path === '/groups' && friendsStore.hasMoreFriends) {
					actionGroups.getGroups(this._groupsBatchSize, groupsStore.groups.length, true);
				} else if (path === '/manage-groups' && friendsStore.hasMoreSubscribers) {
					actionGroups.getmanageGroups(this._groupsBatchSize, groupsStore.manageGroups.length, true);
				} else if (path === '/find-groups' && friendsStore.hasMoreSubscriptions) {
					if (this._searchAreaInput.value.trim() === "") {
						actionGroups.getNotGroups(this._groupsBatchSize, groupsStore.findGroups.length, true);
					} else {
						actionSearch.search(this._searchAreaInput.value.trim(), this._groupsBatchSize, searchStore.communitySearchItems.length, true)
					}
				}

				this.watingForNewItems = true;
			}
		};

		if (this._addGroupBtn !== null) {
			this._addGroupBtn.addEventListener('click', () => {
                if (this._titleField.value.trim() === "") {
					let errField = document.getElementById(NewGroupConst.inputInfo.jsIdError);
					errField.textContent = "Это поле не может быть пустым";
					return
                }
				let privacy = 'open';
				/*if (this._selectField.value == 'Открытая группа') {
					privacy = 'open';
				} else {
					privacy = 'close';
				}*/
				actionGroups.createGroup({title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: false});
				Router.go('/manage-groups', false);
			});
		}

		for (let i = 0; i < this._goToGroup.length; i++) {
			this._goToGroup[i].addEventListener('click', () => {
				const groupId = this._goToGroup[i].getAttribute("data-id");
				Router.go('/group?link=' + groupId, false);
			});
		}

		switch (window.location.pathname) {
			case '/find-groups':
				this._searchAreaInput.addEventListener('keyup', () => {
					if (this._searchAreaInput.value === "") {
						localStorage.removeItem("searchQuery");
						Router.go('/find-groups');
						return
					}
					this.interruptTimer();

					this.startTimer(250, () => {
						if (this._searchAreaInput.value !== "") {
							localStorage.setItem("searchQuery", this._searchAreaInput.value);
							actionSearch.search(this._searchAreaInput.value, this._groupsBatchSize);
						}
					})
				});
				break

		}

		for (let i = 0; i < this._unsubGroup.length; i++) {
			this._unsubGroup[i].addEventListener('click', () => {
				const groupId = this._unsubGroup[i].getAttribute("data-id");
				actionGroups.groupUnsub(groupId);
				event.stopPropagation();
			});
		}
	}

	updateSearchList() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/sign-in');
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
			case '/find-groups':
				res = searchStore.communitySearchItems;
				info = 'Данный запрос не дал результатов'
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
			newGroupData: NewGroupConst,
		}

		Router.rootElement.innerHTML = this._template(this._context);
		this.addPagesElements();
		this.addPagesListener();
		this._searchAreaInput.value = localStorage.getItem("searchQuery");
		this._searchAreaInput.focus();
	}

	showPage() {
		actionUser.getProfile(() => {
			Notifies.getNotifiesCount(true);
			actionGroups.getGroups(15, 0);
			actionGroups.getmanageGroups(15, 0);
			actionGroups.getNotGroups(15, 0);
			//actionGroups.getPopularGroups(15, 0);
		});
	}

	_preRender() {
		this.watingForNewItems = false;

		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/groups':
				res = groupsStore.groups;
				document.title = 'Подписки';
				info = 'Вы не подписаны на сообщества';
				break;
			case '/manage-groups':
				res = groupsStore.manageGroups;
				document.title = 'Сообщества';
				info = 'У вас пока нет сообществ';
				break;
			case '/find-groups':
				res = groupsStore.findGroups;
				document.title = 'Поиск сообществ';
                info = 'Сообщества не найдены';
				break;
			case '/popular-groups':
				res = groupsStore.popularGroups;
				document.title = 'Поиск сообществ';
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
			NewGroupError: groupsStore.error,
		}
	}


	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/sign-in');
			} else {
				this.render();
				this._searchAreaInput.focus();
			}
		}
	}

	render() {
		super.render();

		let query = localStorage.getItem("searchQuery");
		if (window.location.pathname === "/findGroups" && query !== null && query.trim() !== "") {
			this._searchAreaInput.value = query;
			this._searchAreaInput.focus();
			actionSearch.search(this._searchAreaInput.value, this._friendsBatchSize);
		} else {
			localStorage.removeItem("searchQuery");
			this._searchAreaInput.focus();
		}
	}
}
