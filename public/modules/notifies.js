import {actionMessage} from "../actions/actionMessage.js";
import messagesStore from "../stores/messagesStore.js";

class Notifies {

    constructor() {

    }

    getNotifiesCount(render = false) {
        const notifiesCount = document.getElementById('js-msg-notifies');

        actionMessage.notifiesCount((count) => {
            if (notifiesCount) {
                if (count) {
                    notifiesCount.textContent = count;
                } else {
                    notifiesCount.textContent = '';
                }
            }
            if (render) {
                messagesStore._refreshStore();
            }
        });
    }
}

export default new Notifies();
