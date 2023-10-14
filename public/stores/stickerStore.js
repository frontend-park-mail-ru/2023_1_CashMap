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
        const request = await Ajax.getStickerPackInfo(packId);
        const response = await request.json();

        if (request.status === 200) {
            this.stickerPack = response.body;
        } else {
            alert('getStickerPackInfo error');
        }
    }

    async _getStickerPacksByAuthor(count, offset, author) {
        const request = await Ajax.getStickerPacksByAuthor(count, offset, author);
        const response = await request.json();

        if (request.status === 200) {
            this.stickerPacks = response.body.stickerpacks;
            this.stickerPacks.forEach((stickerpack) => {
                stickerpack.stickers.forEach((sticker) => {
                    sticker.url = Ajax.stickerUrlConvert(sticker.url);
                });
            });
        } else {
            alert('getStickerPackInfo error');
        }
    }
}

export default new stickerStore();
