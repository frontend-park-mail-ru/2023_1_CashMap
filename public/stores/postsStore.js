import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";

class postsStore {
    constructor() {
        this._callbacks = [];

        this.posts = [];
        this.friendsPosts = [];
        this.curPost = null;

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
            case 'getFriendsPosts':
                await this._getFriendsPosts(action.count, action.lastPostDate);
                break;
            case 'getPostById':
                await this._getPostsById(action.id, action.count, action.lastPostDate);
                break;
            case 'createPost':
                await this._createPost(action.data);
                break;
            case 'deletePost':
                await this._deletePost(action.postId);
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
            if (response.body.posts) {
                response.body.posts.forEach((post) => {
                    post.isMyPost = true;
                    if (!post.owner_info.url) {
                        post.owner_info.url = headerConst.avatarDefault;
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar = userStore.user.avatar;

                    this.posts.push(post);
                });
            }
            this.posts = response.body.posts;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getPosts error');
        }

        this._refreshStore();
    }

    async _getFriendsPosts(count, lastPostDate) {
        const request = await Ajax.getFriendsPosts(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.posts) {
                response.body.posts.forEach((post) => {
                    post.isMyPost = false;
                    if (!post.owner_info.url) {
                        post.owner_info.url = headerConst.avatarDefault;
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar = userStore.user.avatar;

                    this.posts.push(post);
                });
            }
            this.friendsPosts = response.body.posts;
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
            const response = await request.json();
            const p = response.body.posts[0];

            p.isMyPost = true;
            p.owner_info = {};
            p.owner_info.url = userStore.user.avatar;
            p.owner_info.first_name = userStore.user.firstName;
            p.owner_info.last_name = userStore.user.lastName;
            p.owner_info.link = userStore.user.user_link;
            if (!p.comments) {
                p.comments_count = 0;
            }
            if (p.creation_date) {
                const date = new Date(p.creation_date);
                p.creation_date = (new Date(date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
            }
            p.avatar = userStore.user.avatar;
            this.posts.unshift(p);

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('createPost error');
        }

        this._refreshStore();
    }

    async _deletePost(postId) {
        const request = await Ajax.deletePost(postId);

        if (request.status === 200) {
            let index = -1;
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i].id === postId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.posts.splice(index, 1);
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('deletePost error');
        }

        this._refreshStore();
    }

    async _editPost(text, postId) {
        const request = await Ajax.editPost(text, postId);

        if (request.status === 200) {
            let index = -1;
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i].id === postId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.posts[index].text_content = text;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editPost error');
        }

        this._refreshStore();
    }
}

export default new postsStore();
