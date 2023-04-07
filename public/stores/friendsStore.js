import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class friendsStore {
    constructor() {
        this._callbacks = [];

        this.friends = {
            friendList: [],
        };

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
            case 'getFriends':
                await this._getFriends(action.link, action.count, action.offset);
                break;
            default:
                return;
        }
    }

    async _getFriends(link, count, offset) {
        const request = await Ajax.getFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            this.friends = response.body.friends;
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

export default new friendsStore();
