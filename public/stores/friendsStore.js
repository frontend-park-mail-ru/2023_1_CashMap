import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";

class friendsStore {
    constructor() {
        this._callbacks = [];

        this.friends = {
            friendList: [],
        };

        this.subscribers = [];
        this.subscriptions = [];

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
            case 'getSub':
                await this._getSub(action.type, action.link, action.count, action.offset);
                break;
            case 'sub':
                await this._sub(action.link);
                break;
            case 'unsub':
                await this._unsub(action.link);
                break;
            case 'reject':
                await this._reject(action.link);
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
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    async _getSub(type, link, count, offset) {
        const request = await Ajax.getSub(type, link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (type === 'in') {
                this.subscribers = response.body;
            } else {
                this.subscriptions = response.body;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    async _sub(link) {
        const request = await Ajax.sub(link);

        if (request.status === 200) {
            alert(request.message);
            //ToDo: добавить в локальную шляпу
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    async _unsub(link) {
        const request = await Ajax.unsub(link);

        if (request.status === 200) {
            //ToDo: добавить в локальную шляпу
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    async _reject(link) {
        const request = await Ajax.reject(link);

        if (request.status === 200) {
            //ToDo: добавить в локальную шляпу
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

export default new friendsStore();
