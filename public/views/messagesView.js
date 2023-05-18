import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, activeColor} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";

export default class MessagesView extends BaseView {
	constructor() {
		super();

		this._jsId = 'messages';
		this.curPage = false;
	}

	addStore() {
		messagesStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._msgItem.style.color = activeColor;

		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._goToMsg = document.getElementsByClassName('js-go-chat');
	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const chatId = this._goToMsg[i].getAttribute("data-id");
				localStorage.setItem('chatId', chatId);
				actionMessage.getChatsMsg(chatId,15);
				Router.go('/chat', false);
			});
		}
	}

	showPage() {
		actionUser.getProfile(() => { actionMessage.getChats(100); });
	}

	_preRender() {
		this._template = Handlebars.templates.messages;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		console.log(messagesStore.chats)
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			textInfo: {
				textInfo: 'У вас пока нет чатов',
			},
			messagesData: messagesStore.chats,
		}
	}
}
