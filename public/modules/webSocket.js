import Ajax from "./ajax.js";
import messagesStore from "../stores/messagesStore.js";

class WebSock {
    constructor() {
        this._socket = null;
    }

    open() {
        if (!window['WebSocket']) {
            throw new Error('Ошибка: браузер не поддерживает WebSocket');
        }

        this._socket = new WebSocket("ws://127.0.0.1:8080/api/ws");

        this._socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            messagesStore.messages.push(response);
            console.log(response);
        };
    }

    close() {
        this._socket.close(1000, "ok");
    }
}

export default new WebSock();
