import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";

class messagesStore {
    constructor() {
        this._callbacks = [];

        this.messages = [];
        this.chats = [];

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    _refreshStore() {
        this._callbacks.forEach((callback) => {
            if (callback) {
                callback();
            }
        });
    }

    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'getChats':
                await this._getChats(action.count, action.lastPostDate);
                break;
            case 'getChatsMsg':
                await this._getChatsMsg(action.chatId, action.count, action.lastPostDate);
                break;
            case 'chatCheck':
                await this._chatCheck(action.userLink, action.callback);
                break;
            case 'msgSend':
                await this._msgSend(action.chatId, action.text);
                break;
            case 'chatCreate':
                await this._chatCreate(action.userLinks, action.callback);
                break;
            default:
                return;
        }
    }

    async _getChats(count, lastPostDate) {
        const request = await Ajax.getChats(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.chats = response.body.chats;

            this.chats.forEach((chat) => {
                chat.members.forEach((member) => {
                    if (!member.url) {
                        member.url = headerConst.avatarDefault;
                    }
                    if (member.link !== userStore.user.user_link) {
                        chat.url = member.url;
                        chat.first_name = member.first_name;
                        chat.last_name = member.last_name;
                    }
                });

            });
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getChats error');
        }

        this._refreshStore();
    }

    async _getChatsMsg(chatId, count, lastPostDate) {
        const request = await Ajax.getChatsMsg(chatId, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.messages = response.body.messages;
            this.messages.forEach((message) => {
                if (!message.sender_info.url) {
                    message.sender_info.url = headerConst.avatarDefault;
                }
                message.creation_date = new Date(message.creation_date).toLocaleDateString();
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getChatsMsg error');
        }

        this._refreshStore();
    }

    async _chatCheck(userLink, callback) {
        const request = await Ajax.chatCheck(userLink);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.has_dialog) {
                localStorage.setItem('chatFriendId', response.body.chat_id);
            } else {
                localStorage.removeItem('chatFriendId');
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCheck error');
        }

        if (callback) {
            callback();
        }
    }

    async _msgSend(chatId, text) {
        const request = await Ajax.msgSend(chatId, text);

        if (request.status === 200) {

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('msgSend error');
        }

        this._refreshStore();
    }

    async _chatCreate(userLinks, callback) {
        const request = await Ajax.chatCreate(userLinks);

        if (request.status === 200) {
            const response = await request.json();
            localStorage.setItem('chatId', response.body.chat.chat_id);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCreate error');
        }

        if (callback) {
            callback();
        }
    }
}

export default new messagesStore();
