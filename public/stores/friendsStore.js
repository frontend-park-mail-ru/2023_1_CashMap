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
        //Router.currentPage.render();
        this._callbacks.forEach((callback) => {
            if (callback) {
                callback();
            }
        });
    }

    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'getFriends':
                await this._getFriends(action.friendsCount, action.friendsOffset);
                break;
            default:
                return;
        }
    }

    async _getFriends(friendsCount, friendsOffset) {
        const request = await Ajax.getFriends(friendsCount, friendsOffset);
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
