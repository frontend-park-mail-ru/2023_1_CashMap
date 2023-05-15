import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class imgStore {
    constructor() {
        this._callbacks = [];

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
            case 'uploadImg':
                await this._uploadImg(action.data, action.callback);
                break;
            default:
                return;
        }
    }

    async _uploadImg(data, callback) {
        const request = await Ajax.uploadImg(data);
        const response = await request.json();

        if (request.status === 200) {
            const newUrl = `http://${Ajax.backendHostname}:${Ajax.staticPort}/static/download?name=${ response.body.form[0].name }&type=${ response.body.form[0].type }`;
            callback(newUrl);
        } else {
            alert('uploadImg error');
        }
    }
}

export default new imgStore();
