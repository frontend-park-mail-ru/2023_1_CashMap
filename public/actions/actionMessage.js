import Dispatcher from "../dispatcher/dispatcher.js";

export const actionMessage = {
    getChats(count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getChats',
            count,
            lastPostDate,
        });
    },
    getChatsMsg(chatId, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getChatsMsg',
            chatId,
            count,
            lastPostDate,
        });
    },
    chatCheck(userLink, callback) {
        Dispatcher.dispatch({
            actionName: 'chatCheck',
            userLink,
            callback,
        });
    },
    msgSend(chatId, text, userLink) {
        Dispatcher.dispatch({
            actionName: 'msgSend',
            chatId,
            text,
            userLink,
        });
    },
    chatCreate(userLinks) {
        Dispatcher.dispatch({
            actionName: 'chatCreate',
            userLinks,
        });
    },
};
