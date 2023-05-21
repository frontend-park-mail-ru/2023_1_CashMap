import messagesStore from "../stores/messagesStore.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "../stores/userStore.js";
import Ajax from "./ajax.js";
import chatView from "../views/chatView.js";

/**
 * класс для работы с web сокетами
 */
class WebSock {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        if (Ajax.beckendStatus === 'local') {
            this._url = 'ws://' + Ajax.backendHostname + ':' + Ajax.backendPort + '/api/ws';
        } else {
            this._url = 'wss://' + Ajax.backendHostname + '/api/ws';
        }

        this._socket = null;
    }

    /**
     * метод, открывающий сокет и описывающий реакцию на сообщения
     */
    open() {
        if (!window['WebSocket']) {
            throw new Error('Ошибка: браузер не поддерживает WebSocket');
        }

        if (!this._socket && userStore.user.isAuth) {
            this._socket = new WebSocket(this._url);
        }

        this._socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            response.creation_date = new Date(response.creation_date).toLocaleDateString();
            if (!response.sender_info.avatar_url) {
                response.sender_info.avatar_url = headerConst.avatarDefault;
            } else {
                response.sender_info.avatar_url = Ajax.imgUrlConvert(response.sender_info.avatar_url);
            }

            if (response.sticker) {
                response.sticker.url = Ajax.stickerUrlConvert(response.sticker.url);
            }

            if (localStorage.getItem('chatId') === String(response.chat_id)) {
                messagesStore.messages.push(response);
                localStorage.setItem('curMsg', document.getElementById('js-msg-input').value);
            }
            messagesStore._refreshStore();
        };

        this._socket.onclose = (event) => {
            console.log(event.code);
            open();
        }
    }

    /**
     * метод, закрывающий сокет
     */
    close() {
        this._socket.close(1000, "ok");
    }
}

export default new WebSock();
