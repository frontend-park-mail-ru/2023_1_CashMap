import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";

export default class ChatView extends BaseView {
	constructor() {
		super();
		this._jsId = 'chat';
		this._curMsg = '';
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
		this._sendMsgBlock = document.getElementById('js-send-msg-block');
		this._msg = document.getElementById('js-msg-input');

		this._msg.focus();

		this._f = document.getElementById('js-1');
		this._f.scrollTop = this._f.scrollHeight;

		let textarea = document.getElementsByTagName('textarea');

		textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;overflow-y:hidden;');
		textarea[0].addEventListener("input", OnInput, false);

		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}
	}

	addPagesListener() {
		super.addPagesListener();
		this._backBtn.addEventListener('click', () => {
				Router.goBack();
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
		const chatId = localStorage.getItem('chatId');
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,50); actionMessage.getChats(15); });
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
			chatData: {messages: messagesStore.messages, user: secondUser, chat: curChat, curMsg: localStorage.getItem('curMsg')},
		}
	}
}
