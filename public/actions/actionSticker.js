import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы со стикерами 
 */
export const actionSticker = {
    /**
     * action для получения стикерпака
     * @param {*} packId - идентификатор стикерпака
     */
    getStickerPack(packId) {
        Dispatcher.dispatch({
            actionName: 'getStickerPack',
            packId,
        });
    },
    /**
     * action для получения информации о стикерпаке
     * @param {*} packId - идентификатор стикерпака
     */
    getStickerPackInfo(packId) {
        Dispatcher.dispatch({
            actionName: 'getStickerPackInfo',
            packId,
        });
    },
    /**
     * action для получения списка популярных стикерпаков
     * @param {*} count - количество возвращаемых стикерпаков
     * @param {*} offset - смещение
     */
    getPopularStickerPacks(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getPopularStickerPacks',
            count,
            offset,
        });
    },
    /**
     * action для получения списка стикерпаков по пользователю
     * @param {*} author - пользователь
     * @param {*} count - количество возвращаемых стикерпаков
     * @param {*} offset - смещение
     */
    getStickerPacksByAuthor(author, count, offset) {
        Dispatcher.dispatch({
            actionName: 'getStickerPacksByAuthor',
            author,
            count,
            offset,
        });
    },
    uploadStickerPack(data, callback) {
        Dispatcher.dispatch({
            actionName: 'uploadStickerPack',
            data,
            callback,
        });
    },
};
