import Dispatcher from "../dispatcher/dispatcher.js";

export const actionImg = {
    uploadImg(data, callback) {
        Dispatcher.dispatch({
            actionName: 'uploadImg',
            data,
            callback,
        });
    },
    deleteImg() {
        Dispatcher.dispatch({
            actionName: 'deleteImg',
        });
    },
};
