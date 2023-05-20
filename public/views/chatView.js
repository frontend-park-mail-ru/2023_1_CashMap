import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, activeColor } from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import {actionSticker} from "../actions/actionSticker.js";
import messagesStore from "../stores/messagesStore.js";
import stickerStore from "../stores/stickerStore.js";
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
		stickerStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._backBtn = document.getElementById('js-back-to-messages-btn');
		this._sendMsg = document.getElementById('js-send-msg');
		this._sendMsgBlock = document.getElementById('js-send-msg-block');
		this._msg = document.getElementById('js-msg-input');
		this._smiles = document.getElementsByClassName('js-smile');
		this._smilesBtn = document.getElementsByClassName('smiles-keyboard-icon_smiles');
		this._smilesFrame = document.getElementsByClassName('smiles');
		this._smilesImg = document.getElementById('js-smiles');
		this._smilesImgActive = document.getElementById('js-smiles-active');
		this._stickersBtn = document.getElementsByClassName('smiles-keyboard-icon_stickers');
		this._stickersFrame = document.getElementsByClassName('stickers');
		this._stickersImg = document.getElementById('js-stickers');
		this._stickersImgActive = document.getElementById('js-stickers-active');

		this._smilesImg.style.display='none';
		this._smilesImgActive.style.display='block';

		this._msg.focus();

		this._f = document.getElementById('js-1');
		this._f.scrollTop = this._f.scrollHeight;

		this._textarea = document.getElementsByTagName('textarea');

		this._textarea[0].setAttribute('style', 'height:' + (this._textarea[0].scrollHeight) + 'px;overflow-y:hidden;');
		this._textarea[0].addEventListener("input", OnInput, false);

		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}
	}

	addPagesListener() {
		super.addPagesListener();

		this._backBtn.addEventListener('click', () => {
			Router.goBack();
		})

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

		for (let i = 0; i < this._smilesBtn.length; i++) {
			this._smilesBtn[i].addEventListener('click', () => {
				for (let i = 0; i < this._stickersFrame.length; i++) {
					this._stickersFrame[i].style.display='none';
				}
				for (let i = 0; i < this._smilesFrame.length; i++) {
					this._smilesFrame[i].style.display='block';
				}
				this._smilesImg.style.display='none';
				this._smilesImgActive.style.display='block';
				this._stickersImg.style.display='block';
				this._stickersImgActive.style.display='none';
			});
		}

		for (let i = 0; i < this._stickersBtn.length; i++) {
			this._stickersBtn[i].addEventListener('click', () => {
				for (let i = 0; i < this._smilesFrame.length; i++) {
					this._smilesFrame[i].style.display='none';
				}
				for (let i = 0; i < this._stickersFrame.length; i++) {
					this._stickersFrame[i].style.display='block';
				}
				this._stickersImg.style.display='none';
				this._stickersImgActive.style.display='block';
				this._smilesImg.style.display='block';
				this._smilesImgActive.style.display='none';
			});
		}

		for (let i = 0; i < this._smiles.length; i++) {
			this._smiles[i].addEventListener('click', () => {
				const smile = this._smiles[i].innerText || this._smiles[i].textContent;
				this._msg.value += smile;
				this._msg.focus();
				this._msg.dispatchEvent(new Event('input'));
			});
		}
	}

	showPage() {
		const chatId = localStorage.getItem('chatId');
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,50); actionMessage.getChats(15); });
			actionSticker.getStickerPacksByAuthor(15, 0);
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

			if (curChat.members[0].user_link === userStore.user.user_link && curChat.members.length !== 1) {
				secondUser = curChat.members[1];
			}

		}
		// console.log(stickerStore.stickerPacks);

		stickerStore.stickerPacks.forEach((stickerPack) => {
			console.log(stickerPack)
		});

		this._template = Handlebars.templates.chatPage;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {messages: messagesStore.messages, user: secondUser, chat: curChat, curMsg: localStorage.getItem('curMsg')},
		}
	}
}
