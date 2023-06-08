import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst, sideBarConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";
import Router from "../modules/router.js";
import Notifies from "../modules/notifies.js";
import DateConvert from "../modules/dateConvert.js";

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

        this.hasNextMessages = true;

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
                await this._getChatsMsg(action.callback, action.chatId, action.count, action.lastPostDate, action.isScroll);
                break;
            case 'chatCheck':
                await this._chatCheck(action.userLink, action.callback);
                break;
            case 'msgSend':
                await this._msgSend(action.chatId, action.text, action.stickerId, action.attachments);
                break;
            case 'chatCreate':
                await this._chatCreate(action.userLinks, action.callback);
                break;
            case 'notifiesCount':
                await this._notifiesCount(action.callback);
                break;
            case 'msgRead':
                await this._msgRead(action.chat_id, action.time);
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
                if (chat.last_msg.creation_date) {
                    chat.last_msg.creation_date = DateConvert.fromBackToPost(chat.last_msg.creation_date);
                }

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
    async _getChatsMsg(callback, chatId, count, lastMessageDate, isScroll=true) {
        const request = await Ajax.getChatsMsg(chatId, count, lastMessageDate);

        if (request.status === 200) {
            const response = await request.json();
          
            if (!response.body.messages || response.body.messages.length === 0) {
                this.hasNextMessages = false;
            } else {
                response.body.messages.forEach((message) => {
                    if (!message.sender_info.avatar_url) {
                        message.sender_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        message.sender_info.avatar_url = Ajax.imgUrlConvert(message.sender_info.avatar_url);
                    }

                    if (message.sticker) {
                        message.sticker.url = Ajax.stickerUrlConvert(message.sticker.url);
                    }
                    message.raw_creation_date = message.creation_date;
                    message.creation_date_read = message.creation_date;
                    message.creation_date = DateConvert.fromBackToMsg(message.creation_date);
                   
                  
                    if (message.attachments) {
                      for (let i = 0; i < message.attachments.length; i++) {
                          const url = message.attachments[i];
                          let type = Router._getSearch(url).type;
                          if (type !== 'img') {
                              type = 'file';
                          }
                          message.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                          if (Router._getSearch(url).filename) {
                              message.attachments[i].filename = Router._getSearch(url).filename;
                          }
                      }
                    }
                });
            }

            this.hasNextMessages = response.body.has_next;
            if (isScroll) {
                this.messages = response.body.messages.concat(this.messages);
            } else {
                this.messages = response.body.messages;
            }

            if (callback) {
                callback();
            }
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
    async _msgSend(chatId, text, stickerId, attachments) {
        const request = await Ajax.msgSend(chatId, text, stickerId, attachments);

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

    async _notifiesCount(callback) {
        const request = await Ajax.notifiesCount();

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.count) {
                sideBarConst.menuItemList[2].notifies = response.body.count;
            } else {
                sideBarConst.menuItemList[2].notifies = '';
            }
            if (callback) {
                callback(response.body.count);
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('notifiesCount error');
        }
    }

    async _msgRead(chat_id, time) {
        const request = await Ajax.msgRead(chat_id, time);

        if (request.status === 200) {
            Notifies.getNotifiesCount(true);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('imgRead error');
        }
    }
}

export default new messagesStore();
