import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst } from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import {actionImg} from "../actions/actionImg.js";
import Ajax from "../modules/ajax.js";

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
		postsStore.registerCallback(this.updatePage.bind(this));
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

		this._addPhotoToMsg = document.getElementById('js-add-photo-to-msg');
		this._removeImg = document.getElementsByClassName('js-delete-photo-from-msg');
	}

	addPagesListener() {
		super.addPagesListener();

		this._backBtn.addEventListener('click', () => {
			postsStore.attachments = [];
			Router.goBack();
		})

		this._sendMsg.addEventListener('click', () => {
			if (this._msg.value.length) {
				localStorage.setItem('curMsg', '');
				if (postsStore.attachments.length) {
					let sendAttachments = []
					postsStore.attachments.forEach((img) => {
						if (img.type === 'file') {
							sendAttachments.push(Ajax.imgUrlBackConvert(img.url) + `&filename=${img.filename}`);
						} else {
							sendAttachments.push(Ajax.imgUrlBackConvert(img.url));
						}
					})
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value, sendAttachments);
				} else {
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
				}
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

		if (this._addPhotoToMsg) {
			this._addPhotoToMsg.addEventListener('click', ()=> {
				console.log(postsStore.attachments)
				if (postsStore.attachments === null) {
					postsStore.attachments = [];
				}
				if (postsStore.attachments.length >= 10) {
					return;
				}
				postsStore.text = this._msg.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = () => {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore.attachments.length) {
								id = postsStore.attachments[postsStore.attachments.length-1].id + 1;
							}
							if (Router._getSearch(newUrl).type === 'img') {
								postsStore.attachments.push({url: Ajax.imgUrlConvert(newUrl), id: id, type: 'img'});
							} else {
								postsStore.attachments.push({url: Ajax.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
							}

							postsStore._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore.attachments.length; i++) {
					if (postsStore.attachments[i].id.toString() === imgId) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					postsStore.attachments.splice(index, 1);
				}

				postsStore.text = this._msg.value;
				postsStore._refreshStore();
			});
		}
	}

	showPage() {
		const chatId = localStorage.getItem('chatId');
		postsStore.attachments = [];
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

			if (curChat.members[0].user_link === userStore.user.user_link && curChat.members.length !== 1) {
				secondUser = curChat.members[1];
			}

		}

		this._template = Handlebars.templates.chatPage;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {messages: messagesStore.messages, attachments: postsStore.attachments, user: secondUser, chat: curChat, curMsg: localStorage.getItem('curMsg')},
		}
	}
}
