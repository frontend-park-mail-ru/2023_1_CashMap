import Ajax from "./ajax.js";
import messagesStore from "../stores/messagesStore.js";
import {headerConst} from "../static/htmlConst.js";

class WebSock {
    constructor() {
        this._socket = null;
    }

    open() {
        if (!window['WebSocket']) {
            throw new Error('Ошибка: браузер не поддерживает WebSocket');
        }

        //this._socket = new WebSocket("ws://127.0.0.1:8080/api/ws");
        this._socket = new WebSocket("ws://95.163.212.121:8080/api/ws");

        this._socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            response.creation_date = new Date(response.creation_date).toLocaleDateString();
            if (!response.sender_info.url) {
                response.sender_info.url = headerConst.avatarDefault;
            }
            messagesStore.messages.push(response);
            messagesStore._refreshStore();
        };
    }

    close() {
        this._socket.close(1000, "ok");
    }
}

export default new WebSock();
