import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class imgStore {
    constructor() {
        this._callbacks = [];

        this.editError = '';

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
                await this._uploadImg(action.data, action.callback, action.filename);
                break;
            default:
                return;
        }
    }

    async _uploadImg(data, callback, filename) {
        this.editError = '';
        const request = await Ajax.uploadImg(data, filename);
        const response = await request.json();

        if (request.status === 200) {
            const newUrl = `static-service/download?name=${ response.body.form[0].name }&type=${ response.body.form[0].type }`;
            callback(newUrl);
        } else if (request.status === 413) {
            this.editError = 'Файл слишком большой';
            this._refreshStore();
        } else {
            alert('uploadImg error');
        }
    }
}

export default new imgStore();
