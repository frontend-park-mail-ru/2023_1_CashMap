import Dispatcher from "../dispatcher/dispatcher.js";

export const actionPost = {
    getPosts(data) {
        Dispatcher.dispatch({
            actionName: 'getPosts',
            data: data,
        });
    },
    createPost(data) {
        Dispatcher.dispatch({
            actionName: 'createPost',
            data: data,
        });
    },
    deletePost(data) {
        Dispatcher.dispatch({
            actionName: 'deletePost',
            data: data,
        });
    },
    editPost(data) {
        Dispatcher.dispatch({
            actionName: 'editPost',
            data: data,
        });
    },
};
