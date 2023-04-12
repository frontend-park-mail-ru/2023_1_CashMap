import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";

/**
 * класс, описывающий страницу чата ext install docthis
 */
export default class ChatView extends BaseView {
	constructor() {
		super();
		this._jsId = 'chat';
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		messagesStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}


	addPagesElements() {
		super.addPagesElements();
		this._backBtn = document.getElementById('js-back-to-messages-btn');
		this._sendMsg = document.getElementById('js-send-msg');
		this._msg = document.getElementById('js-msg-input');
	}

	addPagesListener() {
		super.addPagesListener();
		this._backBtn.addEventListener('click', () => {
            Router.go('/message', false);
        });
		this._sendMsg.addEventListener('click', () => {
			actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
		});
	}

	showPage() {
		const chatId = localStorage.getItem('chatId');
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,15); actionMessage.getChats(15); });
		} else {
			Router.goBack();
		}
	}

	_preRender() {
		let curChat = null;
		messagesStore.chats.forEach((chat) => {
			if (String(chat.chat_id) === localStorage.getItem('chatId')) {
				curChat = chat;
			}
		});

		let secondUser = null;
		if (curChat) {
			secondUser = curChat.members[0];
			if (curChat.members[0].link === userStore.user.user_link) {
				secondUser = curChat.members[1];
			}
		}

		this._template = Handlebars.templates.chatPage;
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;
		
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {messages: messagesStore.messages, user: secondUser, chat: curChat},
		}
	}
}
