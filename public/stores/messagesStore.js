import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";

/**
 * класс, хранящий информацию о сообщениях
 */
class messagesStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        this.messages = [];
        this.chats = [];

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    /**
     * Метод, регистрирующий callback
     * @param {*} callback - callback
     */
    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    /**
     * Метод, реализующий обновление хранилища
     */
    _refreshStore() {
        this._callbacks.forEach((callback) => {
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Метод, реализующий реакцию на рассылку диспетчера
     * @param {action} action - действие, которое будет обработано
     */
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

    /**
     * Метод, реализующий реакцию на получение чатов
     * @param {Number} count - количество получаемых чатов
     * @param {Date} lastPostDate - дата, после которой выбираются посты
     */
    async _getChats(count, lastPostDate) {
        const request = await Ajax.getChats(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.chats = response.body.chats;

            this.chats.forEach((chat) => {
                if (chat.members.length === 1) {
                    if (!chat.members[0].avatar_url) {
                        chat.members[0].avatar_url = headerConst.avatarDefault;
                    } else {
                        chat.members[0].avatar_url = Ajax.imgUrlConvert(chat.members[0].avatar_url);
                    }
                    chat.avatar_url = chat.members[0].avatar_url;
                    chat.first_name = chat.members[0].first_name;
                    chat.last_name = chat.members[0].last_name;
                } else {
                    chat.members.forEach((member) => {
                        if (!member.avatar_url) {
                            member.avatar_url = headerConst.avatarDefault;
                        } else {
                            member.avatar_url = Ajax.imgUrlConvert(member.avatar_url);
                        }

                        if (member.user_link !== userStore.user.user_link) {
                            chat.avatar_url = member.avatar_url;
                            chat.first_name = member.first_name;
                            chat.last_name = member.last_name;
                        }
                    });
                }
            });
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getChats error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение сообщений конкретного чата
     * @param {Number} chatId - id чата
     * @param {Number} count - количество получаемых сообщений
     * @param {Date} lastPostDate - дата, после которой выбираются сообщения
     */
    async _getChatsMsg(chatId, count, lastPostDate) {
        const request = await Ajax.getChatsMsg(chatId, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.messages = response.body.messages;
            this.messages.forEach((message) => {
                if (!message.sender_info.avatar_url) {
                    message.sender_info.avatar_url = headerConst.avatarDefault;
                } else {
                    message.sender_info.avatar_url = Ajax.imgUrlConvert(message.sender_info.avatar_url);
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

    /**
     * Метод, реализующий реакцию на проверку чата пользователя
     * @param {String} userLink - сслыка на пользователя 
     */
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

    /**
     * Метод, реализующий реакцию на запрос об отправке сообщения
     * @param {Number} chatId - id чата
     * @param {String} text - текст сообщения
     */
    async _msgSend(chatId, text) {
        const request = await Ajax.msgSend(chatId, text);

        if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status !== 200) {
            alert('msgSend error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на запрос о создании чата
     * @param {*} userLinks - id пользователей чата
     */
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
