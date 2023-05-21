import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class stickerStore {
    constructor() {
        this._callbacks = [];

        this.stickerPacks = [];
        this.stickerPack = null;

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

    /**
     * Метод, реализующий реакцию на рассылку диспетчера
     * @param {action} action - действие, которое будет обработано
     */
    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'getStickerPackInfo':
                await this._getStickerPackInfo(action.packId);
                break;
            case 'getStickerPacksByAuthor':
                await this._getStickerPacksByAuthor(action.count, action.offset, action.author);
                break;
            default:
                return;
        }
    }

    async _getStickerPackInfo(packId) {
        const request = await Ajax._getStickerPackInfo(packId);
        const response = await request.json();

        if (request.status === 200) {
            console.log(response.body);
            console.log(response.body.stickerPack);
            this.stickerPack = response.body.stickerPack;
        } else {
            alert('getStickerPackInfo error');
        }
    }

    async _getStickerPacksByAuthor(count, offset, author) {
        const request = await Ajax._getStickerPacksByAuthor(count, offset, author);
        const response = await request.json();

        if (request.status === 200) {
            console.log(response.body);
            console.log(response.body.stickerPacks);
            this.stickerPacks = response.body.stickerPacks;
        } else {
            alert('getStickerPackInfo error');
        }
    }
}

export default new stickerStore();
