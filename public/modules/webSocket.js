import messagesStore from "../stores/messagesStore.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "../stores/userStore.js";
import Ajax from "./ajax.js";
import Router from "./router.js";
import {actionMessage} from "../actions/actionMessage.js";
import Notifies from "./notifies.js";
import DateConvert from "./dateConvert.js";

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

        if (!this._socket && userStore.user.isAuth && navigator.onLine) {
            this._socket = new WebSocket(this._url);
            //console.log('WebSocket opened');
        }

        this._socket.onmessage = function(event) {
            const response = JSON.parse(event.data);

            if (localStorage.getItem('chatId') === String(response.chat_id) && (Router.currentPage._jsId === 'chat')) {
                actionMessage.msgRead(localStorage.getItem('chatId'), response.creation_date);

                response.creation_date = DateConvert.fromBackToMsg(response.creation_date);

                if (!response.sender_info.avatar_url) {
                    response.sender_info.avatar_url = headerConst.avatarDefault;
                } else {
                    response.sender_info.avatar_url = Ajax.imgUrlConvert(response.sender_info.avatar_url);
                }

                if (response.sticker) {
                    response.sticker.url = Ajax.stickerUrlConvert(response.sticker.url);
                }

                if (response.attachments) {
                    for (let i = 0; i < response.attachments.length; i++) {
                        const url = response.attachments[i];
                        let type = Router._getSearch(url).type;
                        if (type !== 'img') {
                            type = 'file';
                        }
                        response.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                        if (Router._getSearch(url).filename) {
                            response.attachments[i].filename = Router._getSearch(url).filename;
                        }
                    }
                }
                messagesStore.messages.push(response);
                if (document.getElementById('js-msg-input')) {
                    localStorage.setItem('curMsg', document.getElementById('js-msg-input').value);
                }

                messagesStore._refreshStore();
            } else {
                if (localStorage.getItem('or-off') === 'true') {
                    let audio = new Audio('static/img/msg_fly.mp3');
                    audio.play();
                }

                Notifies.getNotifiesCount();
                actionMessage.getChats(100);
            }
        };

        this._socket.onclose = (event) => {
            //console.log(`WebSocket closed `, event.code);
            this._socket = null;
            this.open();
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
