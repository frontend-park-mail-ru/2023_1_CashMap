import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с сообщениями 
 */
export const actionMessage = {
    /**
     * action для получения списка чата пользователей
     * @param {*} count - количестко возвращаемых чатов
     * @param {*} lastPostDate - дата, после которой получаются чаты
     */
    getChats(count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getChats',
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения сообщений конкретного чата
     * @param {*} chatId - id чата
     * @param {*} count - количество возвращаемых сообщений
     * @param {*} lastPostDate - дата, после которой получаются сообщения
     */
    getChatsMsg(callback, chatId, count, lastPostDate, isScroll=false) {
        Dispatcher.dispatch({
            actionName: 'getChatsMsg',
            callback,
            chatId,
            count,
            lastPostDate,
            isScroll
        });
    },
    /**
     * action для проверки наличия чата с конктретным пользователем
     * @param {*} userLink - ссылка на пользователя, с которым проверяем наличие чата
     */
    chatCheck(userLink, callback) {
        Dispatcher.dispatch({
            actionName: 'chatCheck',
            userLink,
            callback,
        });
    },
    /**
     * action для отправки сообщения в чат
     * @param {*} chatId - id чата
     * @param {*} text - текст отправляемого сообщения
     */
    msgSend(chatId, text, stickerId, attachments = null) {
        Dispatcher.dispatch({
            actionName: 'msgSend',
            chatId,
            text,
            attachments,
            stickerId,
        });
    },
    /**
     * action для создания нового чата
     * @param {*} userLinks - ссылки на поьзователей-участников чата
     */
    chatCreate(userLinks, callback) {
        Dispatcher.dispatch({
            actionName: 'chatCreate',
            userLinks,
            callback,
        });
    },

    notifiesCount(callback) {
        Dispatcher.dispatch({
            actionName: 'notifiesCount',
            callback,
        });
    },

    msgRead(chat_id, time) {
        Dispatcher.dispatch({
            actionName: 'msgRead',
            chat_id,
            time,
        });
    },
};
