import Dispatcher from "../dispatcher/dispatcher.js";

export const actionPost = {
    getPosts(count, offset) {
        Dispatcher.dispatch({
            actionName: 'getPosts',
            postsCount: count,
            postsOffset: offset,
        });
    },
    createPost(data) {
        Dispatcher.dispatch({
            actionName: 'createPost',
            data: data
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
