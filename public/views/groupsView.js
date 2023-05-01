import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, groupsMenuInfo, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionGroups} from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";
import BaseView from "./baseView.js";

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
	}

	addPagesElements() {
		super.addPagesElements();
		this._backBtn = document.getElementById('js-back-to-messages-btn');
		this._sendMsg = document.getElementById('js-send-msg');
		this._sendMsgBlock = document.getElementById('js-send-msg-block');
		this._msg = document.getElementById('js-msg-input');
	}

	addPagesListener() {
		super.addPagesListener();
		this._backBtn.addEventListener('click', () => {
            Router.go('/message', false);
		});

		this._sendMsg.addEventListener('click', () => {
			if (this._msg.value.length) {
				localStorage.setItem('curMsg', '');
				actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
				this._msg.value = '';
			}
		});

		this._msg.addEventListener('input', (event) => {
			if (event.target.value.length) {
				this._sendMsg.classList.remove('display-none');
				this._sendMsgBlock.classList.add('display-none');
			} else {
				this._sendMsg.classList.add('display-none');
				this._sendMsgBlock.classList.remove('display-none');
			}
		});

		this._msg.addEventListener("keydown", function(event) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				document.getElementById("js-send-msg").click();
			}
		});
	}

    showPage() {
		actionUser.getProfile(() => {
			actionGroups.getGroups(userStore.user.user_link, 15, 0);
			actionGroups.getUserGroups(userStore.user.user_link, 15, 0);
			actionGroups.getNotGroups(userStore.user.user_link, 15, 0);
			actionGroups.getPopularGroups(15, 0);
		});
	}

	_preRender() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

        let res;
		let info;
		switch (window.location.pathname) {
			case '/groups':
				res = groupsStore.groups;
				info = 'Вы не подписаны на сообщества';
				break;
			case '/userGroups':
				res = groupsStore.userGroups;
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
        let friendsData = [{
            group_link: 1,
            avatar: 'static/img/post_icons/profile_image.svg',
            name: 'Карина',
            subscribers: 123,
            isGroup: true
        },
        {
            group_link: 2,
            avatar: 'static/img/post_icons/profile_image.svg',
            name: 'Карина',
            subscribers: 123,
            isNotGroup: true
        },
        {
            group_link: 3,
            avatar: 'static/img/post_icons/profile_image.svg',
            name: 'Карина',
            subscribers: 123,
            isGroup: true
        },
        {
            group_link: 4,
            avatar: 'static/img/post_icons/profile_image.svg',
            name: 'Карина',
            subscribers: 123,
            isGroup: true
        },
    ]

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			//groupsData: res,
			groupsData: friendsData,
			textInfo: {
				textInfo: info,
			},
			menuInfo: groupsMenuInfo,
		}
	}
}
