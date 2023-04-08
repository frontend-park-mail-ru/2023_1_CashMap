import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";

class postsStore {
    constructor() {
        this._callbacks = [];

        this.posts = [];
        this.curPost = null;
        this.curPostId = null;

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
            case 'getPostById':
                await this._getPostsById(action.id, action.count, action.lastPostDate);
                break;
            case 'createPost':
                await this._createPost(action.data);
                break;
            case 'deletePost':
                await this._deletePost(action.data);
                break;
            case 'editPost':
                await this._editPost(action.text, action.postId);
                break;
            default:
                return;
        }
    }

    async _getPosts(userLink, count, lastPostDate) {
        const request = await Ajax.getPosts(userLink, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            response.body.posts.forEach((post) => {
                if (!post.sender_photo) {
                    post.sender_photo = headerConst.avatarDefault;
                }
                if (!post.sender_first_name) {
                    post.sender_first_name = 'ToDo:';
                }
                if (!post.sender_last_name) {
                    post.sender_last_name = 'Переделать-ручку получения постов';
                }
                if (!post.comments) {
                    post.comments_count = 0;
                }
                if (post.creation_date) {
                    post.creation_date = "ToDo: парсить дату"
                }
                post.avatar = userStore.user.avatar;

                this.posts.push(post);
            });
            this.posts = response.body.posts;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getPosts error');
        }

        this._refreshStore();
    }

    async _getPostsById(id, count, lastPostDate) {
        const request = await Ajax.getPostById(id, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.curPost = response.body.posts[0];

            console.log(this.curPost);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getPostById error');
        }

        this._refreshStore();
    }

    async _createPost(data) {
        const request = await Ajax.createPost(data);

        if (request.status === 200) {
            alert('done')
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('createPost error');
        }

        this._refreshStore();
    }

    async _deletePost() {

    }

    async _editPost(text, postId) {
        const request = await Ajax.editPost(text, postId);

        if (request.status === 200) {
            alert('done');
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editPost error');
        }

        this._refreshStore();
    }
}

export default new postsStore();
