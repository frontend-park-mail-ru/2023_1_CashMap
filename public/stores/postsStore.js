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
                await this._getPosts(action.userLink, action.count, action.lastPostDate);
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

    async _getPosts(userLink, count, lastPostDate) {
        const request = await Ajax.getPosts(userLink, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.posts = response.body.posts;

            console.log(this.posts);
        } else {
            alert('getPosts error');
        }

        this._refreshStore();
    }

    async _createPost(data) {
        const request = await Ajax.createPosts(data);

        if (request.status === 200) {

        } else {
            alert('createPost error');
        }

        this._refreshStore();
    }

    async _deletePost() {

    }

    async _editPost() {

    }

}

export default new postsStore();
