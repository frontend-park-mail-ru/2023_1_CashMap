import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";

/**
 * класс, хранящий информацию о постах
 */
class postsStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        // this.posts = [];
        this.friendsPosts = [];
        // this.groupsPosts = [];
        this.curPost = null;

        this.comments = new Map();
        this.haveCommentsContinuation = new Map();

        this.currentComment = null;

        Dispatcher.register(this._fromDispatch.bind(this));
    }

    /**
     * Метод, регистрирующий callback
     * @param {*} callback - callback
     */
    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    /**
     * Метод, реализующий обновление хранилища
     */
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
            case 'getPosts':
                await this._getPosts(action.userLink, action.count, action.lastPostDate);
                break;
            case 'getFriendsPosts':
                await this._getFriendsPosts(action.count, action.lastPostDate);
                break;
            case 'getPostById':
                await this._getPostsById(action.id, action.count, action.lastPostDate);
                break;
            case 'getPostsByCommunity':
                await this._getPostsByCommunity(action.community_link, action.count, action.lastPostDate);
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
            case 'likePost':
                await this._likePost(action.postId);
                break;
            case 'dislikePost':
                await this._dislikePost(action.postId);
                break;
            case 'getComment':
                await this.getCommentById(action.id);
                break;
            case 'getComments':
                await this.getCommentsByPostId(action.postID, action.count, action.lastCommentDate);
                break;
            case 'createComment':
                await this.createComment(action.postID, action.replyTo, action.text);
                break;
            case 'deleteComment':
                await this.deleteComment(action.id);
                break;
            case 'editComment':
                await this.editComment(action.id, action.text);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение постов 
     * @param {String} userLink - ссылка пользователя
     * @param {Number} count - количество возвращаемых постов
     * @param {Date} lastPostDate - дата, после которой возвращаются посты
     */
    async _getPosts(userLink, count, lastPostDate) {
        const request = await Ajax.getPosts(userLink, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.posts) {
                response.body.posts.forEach((post) => {
                    if (userLink === userStore.user.user_link) {
                        post.isMyPost = true;
                    } else {
                        post.isMyPost = false;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.userProfile.avatar_url;

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

    /**
     * Метод, реализующий реакцию на получение постов друзей 
     * @param {Number} count - количество возвращаемых постов
     * @param {Date} lastPostDate - дата, после которой возвращаются посты
     */
    async _getFriendsPosts(count, lastPostDate) {
        const request = await Ajax.getFriendsPosts(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.posts) {
                response.body.posts.forEach((post) => {
                    post.isMyPost = false;
                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    }
                    if (post.community_info) {
                        if (!post.community_info.avatar_url) {
                            post.community_info.avatar_url = headerConst.avatarDefault;
                        }
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.user.avatar_url;

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

    async getCommentsByPostId(postID, count, lastPostDate) {
        const request = await Ajax.getCommentsByPostId(postID, count, lastPostDate);
        if (request.status === 200) {
            const response = await request.json();
            if (response.body.comments === null) {
                this.haveCommentsContinuation.set(postID, response.body.has_next);
                return
            }
            response.body.comments.forEach((comment) => {
                if (comment.sender_info.avatar_url === null) {
                    comment.sender_info.avatar_url = headerConst.avatarDefault;
                }

                comment.raw_creation_date = comment.creation_date.replace("+", "%2B");
                comment.creation_date = (new Date(comment.creation_date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
                comment.change_date = (new Date(comment.change_date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
            })


            if (this.comments.has(postID)) {
                this.comments.get(postID).push(...response.body.comments);
            } else {
                this.comments.set(postID, response.body.comments);
            }
            this.haveCommentsContinuation.set(postID, response.body.has_next);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('get comments error');
        }

        this._refreshStore();
    }

    async getCommentById(id) {
        const request = await Ajax.getCommentById(id);

        if (request.status === 200) {
            const response = await request.json();
            this.currentComment = response.body.comment;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('get comment error');
        }

        this._refreshStore();
    }

    async createComment(postID, replyReceiver, text) {
        const request = await Ajax.createComment(postID, replyReceiver, text);

        if (request.status === 200) {
            const response = await request.json();

            for (let post of this.friendsPosts) {
                if (post.id === postID) {
                    post.comments_amount += 1;
                }
            }

            if (this.comments.get(postID) !== undefined) {
                this.comments.delete(postID)
            }

            await this.getCommentsByPostId(postID);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('create comment error');
        }

        this._refreshStore();
    }

    async editComment(id, text) {
        const request = await Ajax.editComment(id, text);

        if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status !== 200) {
            alert('edit comment error');
        }

        this._refreshStore();
    }

    async deleteComment(id) {
        const request = await Ajax.deleteComment(id);

        if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status !== 200) {
            alert('delete comment error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение постов по id
     * @param {Number} id - id поста
     * @param {Number} count - количество возвращаемых постов
     * @param {Date} lastPostDate - дата, после которой возвращаются посты
     */
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

    async _getPostsByCommunity(community_link, count, lastPostDate) {
        const request = await Ajax.getPostsByCommunity(community_link, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            this.friendsPosts = [];
            console.log(response.body)
            response.body.posts.forEach((post) => {
                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                }
                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = headerConst.avatarDefault;
                }

                if (!post.comments) {
                    post.comments_count = 0;
                }
                if (post.creation_date) {
                    const date = new Date(post.creation_date);
                    post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                }
                post.avatar_url = userStore.user.avatar_url;
            });

            this.friendsPosts = response.body.posts;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getPostsByCommunity error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на создание поста
     * @param {Date} data - данные для поста
     */
    async _createPost(data) {
        const request = await Ajax.createPost(data);

        if (request.status === 200) {
            const response = await request.json();
            const p = response.body.posts[0];

            p.isMyPost = true;
            p.owner_info = {};
            p.owner_info.avatar_url = userStore.user.avatar_url;
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
            p.avatar_url = userStore.user.avatar_url;
            this.friendsPosts.unshift(p);

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('createPost error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на удаление поста
     * @param {Number} postId - id поста
     */
    async _deletePost(postId) {
        const request = await Ajax.deletePost(postId);

        if (request.status === 200) {
            let index = -1;
            for (let i = 0; i < this.friendsPosts.length; i++) {
                if (this.friendsPosts[i].id === postId) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.friendsPosts.splice(index, 1);
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('deletePost error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на изменение поста
     * @param {Text} text - текст поста
     * @param {Number} postId - id поста
     */
    async _editPost(text, postId) {
        const request = await Ajax.editPost(text, postId);

        if (request.status === 200) {
            let index = -1;
            for (let i = 0; i < this.friendsPosts.length; i++) {
                if (this.friendsPosts[i].id === Number(postId)) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.friendsPosts[index].text_content = text;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editPost error');
        }

        this._refreshStore();
    }
    /**
     * Метод, реализующий лайк поста
     * @param {Number} postId - id поста
     */
    async _likePost(postId) {
        const request = await Ajax.likePost(postId);

        if (request.status === 200) {
            const response = await request.json();

            this.friendsPosts.forEach((post) => {
                if (post.id === Number(postId)) {
                    post.is_liked = true;
                    post.likes_amount = response.body.likes_amount;
                }
            });
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('likePost error');
        }

        this._refreshStore();
    }
    /**
     * Метод, реализующий дизлайк поста
     * @param {Number} postId - id поста
     */
    async _dislikePost(postId) {
        const request = await Ajax.dislikePost(postId);

        let flag = null;
        if (request.status === 200) {
            this.friendsPosts.forEach((post) => {
                if (post.id === Number(postId)) {
                    if (flag === null) {
                        flag = post.likes_amount - 1;
                    }
                    post.is_liked = false;
                    post.likes_amount = flag;
                }
            });
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('dislikePost error');
        }

        this._refreshStore();
    }
}

export default new postsStore();
