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
                await this._msgSend(action.chatId, action.text, action.userLink);
                break;
            case 'chatCreate':
                await this._chatCreate(action.userLinks);
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

            console.log(response.body);
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

            console.log(response.body);
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
            console.log(request);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCheck error');
        }

        if (callback) {
            callback();
        }
    }

    async _msgSend(chatId, text, userLink) {
        const request = await Ajax.msgSend(chatId, text, userLink);

        if (request.status === 200) {
            alert('done');
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('msgSend error');
        }

        this._refreshStore();
    }

    async _chatCreate(userLinks) {
        const request = await Ajax.chatCreate(userLinks);

        if (request.status === 200) {
            alert('done');
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCreate error');
        }

        this._refreshStore();
    }
}

export default new messagesStore();
