import Dispatcher from "../dispatcher/dispatcher.js";

export const actionImg = {
    uploadImg(data, callback, filename = null) {
        Dispatcher.dispatch({
            actionName: 'uploadImg',
            data,
            callback,
            filename,
        });
    },
    deleteImg() {
        Dispatcher.dispatch({
            actionName: 'deleteImg',
        });
    },
};
