import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class postsStore {
    constructor() {
        this._callbacks = [];

        this.posts = {
            postList: [],
        };

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
            case 'getPosts':
                await this._getPosts(action.postsCount, action.postsOffset);
                break;
            case 'createPost':
                await this._createPost(action.data);
                break;
            case 'deletePost':
                await this._deletePost(action.data);
                break;
            case 'editPost':
                await this._editPost(action.data);
                break;
            default:
                return;
        }
    }

    async _getPosts(postsCount, postsOffset) {
        const request = await Ajax.getPosts(postsCount, postsOffset);
        const response = await request.json();

        if (request.status === 200) {
            this.posts = response.body.posts;
        } else {
            alert('getPosts error');
        }

        this._refreshStore();
    }

    async _createPost(data) {

    }

    async _deletePost() {

    }

    async _editPost() {

    }

}

export default new postsStore();
