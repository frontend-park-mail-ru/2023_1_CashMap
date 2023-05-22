import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, activeColor, emotionKeyboard} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionMessage} from "../actions/actionMessage.js";
import {actionSticker} from "../actions/actionSticker.js";
import messagesStore from "../stores/messagesStore.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import {actionImg} from "../actions/actionImg.js";
import Ajax from "../modules/ajax.js";
import stickerStore from "../stores/stickerStore.js";

export default class ChatView extends BaseView {
	constructor() {
		super();
		this._jsId = 'chat';
		this._curMsg = '';

		this._messageBatchSize = 20;
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
		this._smiles = document.getElementsByClassName('js-smile');
		this._stickers = document.getElementsByClassName('js-sticker');
		this._smilesBtn = document.getElementsByClassName('smiles-keyboard-icon_smiles');
		this._smilesFrame = document.getElementsByClassName('smiles');
		this._smilesImg = document.getElementById('js-smiles');
		this._smilesImgActive = document.getElementById('js-smiles-active');
		this._stickersBtn = document.getElementsByClassName('smiles-keyboard-icon_stickers');
		this._stickersFrame = document.getElementsByClassName('stickers');
		this._stickersImg = document.getElementById('js-stickers');
		this._stickersImgActive = document.getElementById('js-stickers-active');
		this._emotionBtn = document.getElementById('js-chat-smiles');
		this._emotionKeyboard = document.getElementById('js-smiles-keyboard');
		this._install = document.getElementsByClassName('js-file-i');

		this._smilesImg.style.display='none';
		this._smilesImgActive.style.display='block';

		this._msg.focus();

		this._msgList = document.getElementById('js-1');
		this._msgList.scrollTop = this._msgList.scrollHeight;

		this._textarea = document.getElementsByTagName('textarea');

		this._textarea[0].setAttribute('style', 'height:' + (this._textarea[0].scrollHeight) + 'px;overflow-y:hidden;');
		this._textarea[0].addEventListener("input", OnInput, false);

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
					postsStore.attachments = [];
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value, null ,sendAttachments);
				} else {
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
				}
				this._msg.value = '';
			}
		});

		this._msgList.addEventListener('scroll', () => {
			if (this._msgList.scrollTop <= 0 && !this.watingForNewPosts && messagesStore.hasNextMessages) {
				actionMessage.getChatsMsg(localStorage.getItem('chatId'), this._messageBatchSize, messagesStore.messages.at(0).raw_creation_date, true);
				this.watingForNewPosts = true;
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
				if (postsStore.attachments === null) {
					postsStore.attachments = [];
				}
				if (postsStore.attachments.length >= 10) {
					return;
				}
				localStorage.setItem('curMsg', this._msg.value);
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

				localStorage.setItem('curMsg', this._msg.value);
				postsStore._refreshStore();
      });
    }

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
				this._msg.focus();
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
				this._msg.focus();
			});
		}

		this._emotionBtn.addEventListener('click', () => {
			if (this._emotionKeyboard.style.display === 'block') {
				this._emotionKeyboard.style.display = 'none';
			} else {
				this._emotionKeyboard.style.display = 'block';
			}
			this._msg.focus();
		});

		for (let i = 0; i < this._smiles.length; i++) {
			this._smiles[i].addEventListener('click', () => {
				const smile = this._smiles[i].innerText || this._smiles[i].textContent;
				this._msg.value += smile;
				this._msg.focus();
				this._msg.dispatchEvent(new Event('input'));
			});
		}

		for (let i = 0; i < this._stickers.length; i++) {
			this._stickers[i].addEventListener('click', () => {
				localStorage.setItem('curMsg', '')
				actionMessage.msgSend(localStorage.getItem('chatId'), '', parseInt(this._stickers[i].getAttribute("data-id")));
			});
		}

		for (let i = 0; i < this._install.length; i++) {
			this._install[i].addEventListener('click', () => {
				const url = this._install[i].getAttribute("data-id");
				window.open(url, '_blank');
			});
		}

		if (this._msg.value || postsStore.attachments.length) {
			this._sendMsg.classList.remove('display-none');
			this._sendMsgBlock.classList.add('display-none');
		} else {
			this._sendMsg.classList.add('display-none');
			this._sendMsgBlock.classList.remove('display-none');
		}
	}

	showPage() {
		const chatId = localStorage.getItem('chatId');
		postsStore.attachments = [];
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,this._messageBatchSize); actionMessage.getChats(15); });
			actionSticker.getStickerPacksByAuthor(15, 0);
		} else {
			Router.goBack();
		}
	}

	_preRender() {
		this.watingForNewPosts = false;

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
			chatData: {messages: messagesStore.messages, attachments: postsStore.attachments, user: secondUser, chat: curChat, curMsg: localStorage.getItem('curMsg'), keyboardData: {smiles: emotionKeyboard, stickerpacks: {stickerpacks :stickerStore.stickerPacks}}},
		}
	}
}
