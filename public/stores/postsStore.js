import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {groupAvatarDefault, headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";
import groupsStore from "./groupsStore.js";
import Router from "../modules/router.js";
import DateConvert from "../modules/dateConvert";
import dateConvert from "../modules/dateConvert";

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

        this.posts = [];
        this.attachments = [];
        this.deleteAttachments = [];
        this.addAttachments = [];
        this.text = '';

        this.curPost = null;

        this.comments = new Map();
        this.haveCommentsContinuation = new Map();

        this.currentComment = null;

        this.hasMorePosts = true;

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
                await this._getPosts(action.userLink, action.count, action.lastPostDate, action.isScroll);
                break;
            case 'getFeedPosts':
                await this._getFeedPosts(action.count, action.lastPostDate, action.isScroll);
                break;
            case 'getPostById':
                await this._getPostsById(action.id, action.count, action.lastPostDate);
                break;
            case 'getPostsByCommunity':
                await this._getPostsByCommunity(action.community_link, action.count, action.lastPostDate, action.isScroll);
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
    async _getPosts(userLink, count, lastPostDate, isScroll=false) {
        const request = await Ajax.getPosts(userLink, count, lastPostDate);
        if (request.status === 200) {
            const response = await request.json();

            if (response.body.posts && response.body.posts.length !== 0) {
                this.hasMorePosts = true;
                response.body.posts.forEach((post) => {
                    post.canDelite = post.canEdit = false;
                    if (post.author_link === userStore.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore.user.user_link) {
                        post.canDelite = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = Ajax.imgUrlConvert(post.owner_info.avatar_url);
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.raw_creation_date = post.creation_date.replace("+", "%2B");
                        post.creation_date = DateConvert.fromBackToPost(date);
                    }
                    post.avatar_url = userStore.userProfile.avatar_url;

                    if (post.attachments) {
                        for (let i = 0; i < post.attachments.length; i++) {
                            const url = post.attachments[i];
                            let type = Router._getSearch(url).type;
                            if (type !== 'img') {
                                type = 'file';
                            }
                            post.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                            if (Router._getSearch(url).filename) {
                                post.attachments[i].filename = Router._getSearch(url).filename;
                            }
                        }
                    }
                });
            } else {
                this.hasMorePosts = false;
            }

            if (!isScroll) {
                this.posts = response.body.posts;
            } else {
                this.posts.push(...response.body.posts);
            }
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
    async _getFeedPosts(count, lastPostDate, isScroll=false) {
        const request = await Ajax.getFriendsPosts(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.posts && response.body.posts.length !== 0) {
                this.hasMorePosts = true;
                response.body.posts.forEach((post) => {

                    post.canDelite = post.canEdit = false;
                    if (post.author_link === userStore.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore.user.user_link) {
                        post.canDelite = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = Ajax.imgUrlConvert(post.owner_info.avatar_url);
                    }
                    if (post.community_info) {
                        if (!post.community_info.avatar_url) {
                            post.community_info.avatar_url = groupAvatarDefault;
                        } else {
                            post.community_info.avatar_url = Ajax.imgUrlConvert(post.community_info.avatar_url);
                        }
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.raw_creation_date = post.creation_date.replace("+", "%2B");
                        post.creation_date = DateConvert.fromBackToPost(date);
                        //post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.user.avatar_url;

                    if (post.attachments) {
                        for (let i = 0; i < post.attachments.length; i++) {
                            const url = post.attachments[i];
                            let type = Router._getSearch(url).type;
                            if (type !== 'img') {
                                type = 'file';
                            }
                            post.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                            if (Router._getSearch(url).filename) {
                                post.attachments[i].filename = Router._getSearch(url).filename;
                            }
                        }
                    }
                });
            } else {
                this.hasMorePosts = false;
            }

            if (isScroll) {
                this.posts.push(...response.body.posts);
            } else {
                this.posts = response.body.posts;
            }
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
                } else {
                    comment.sender_info.avatar_url = Ajax.imgUrlConvert(comment.sender_info.avatar_url);
                }

                comment.raw_creation_date = comment.creation_date.replace("+", "%2B");
                comment.creation_date = DateConvert.fromBackToPost(comment.creation_date);
                comment.change_date = DateConvert.fromBackToPost(comment.change_date);
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

            for (let post of this.posts) {
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

            if (response.body.posts[0].attachments) {
                for (let i = 0; i < response.body.posts[0].attachments.length; i++) {
                    const url = response.body.posts[0].attachments[i];
                    let type = Router._getSearch(url).type;
                    if (type !== 'img') {
                        type = 'file';
                    }
                    response.body.posts[0].attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                    if (Router._getSearch(url).filename) {
                        response.body.posts[0].attachments[i].filename = Router._getSearch(url).filename;
                    }
                }
            }
            this.curPost = response.body.posts[0];
            this.attachments = response.body.posts[0].attachments;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getPostById error');
        }

        this._refreshStore();
    }

    async _getPostsByCommunity(community_link, count, lastPostDate, isScroll=false) {
        const request = await Ajax.getPostsByCommunity(community_link, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.posts && response.body.posts.length !== 0) {
                this.hasMorePosts = true;
                response.body.posts.forEach((post) => {

                    post.canDelite = post.canEdit = false;
                    groupsStore.curGroup.management.forEach((user) => {
                        if (user.link === userStore.user.user_link) {
                            post.canDelite = post.canEdit = true;
                        }
                    });

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = Ajax.imgUrlConvert(post.owner_info.avatar_url);
                    }
                    if (!post.community_info.avatar_url) {
                        post.community_info.avatar_url = groupAvatarDefault;
                    } else {
                        post.community_info.avatar_url = Ajax.imgUrlConvert(post.community_info.avatar_url);
                    }

                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.raw_creation_date = post.creation_date.replace("+", "%2B");
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.user.avatar_url;
                    if (post.attachments) {
                        for (let i = 0; i < post.attachments.length; i++) {
                            const url = post.attachments[i];
                            let type = Router._getSearch(url).type;
                            if (type !== 'img') {
                                type = 'file';
                            }
                            post.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                            if (Router._getSearch(url).filename) {
                                post.attachments[i].filename = Router._getSearch(url).filename;
                            }
                        }
                    }
                });
            } else {
                this.hasMorePosts = false;
            }

            if (isScroll) {
                this.posts.push(...response.body.posts);
            } else {
                this.posts = response.body.posts;
            }
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
        data['attachments'] = [];
        this.deleteAttachments = [];
        this.addAttachments = [];
        this.attachments.forEach((img) => {
            if (img.type === 'file') {
                data.attachments.push(Ajax.imgUrlBackConvert(img.url) + `&filename=${img.filename}`);
            } else {
                data.attachments.push(Ajax.imgUrlBackConvert(img.url));
            }
        });
        this.attachments = [];
        const request = await Ajax.createPost(data);

        if (request.status === 200) {
            const response = await request.json();
            const post = response.body.posts[0];

            if (post.owner_info) {
                post.canDelite = post.canEdit = false;
                if (post.author_link === userStore.user.user_link) {
                    post.canDelite = post.canEdit = true;
                } else if (post.owner_info.user_link === userStore.user.user_link) {
                    post.canDelite = true;
                }

                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.owner_info.avatar_url = Ajax.imgUrlConvert(post.owner_info.avatar_url);
                }
            }

            if (post.community_info) {
                post.canDelite = post.canEdit = false;
                groupsStore.curGroup.management.forEach((user) => {
                    if (user.link === userStore.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    }
                });

                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = groupAvatarDefault;
                } else {
                    post.community_info.avatar_url = Ajax.imgUrlConvert(post.community_info.avatar_url);
                }
            }

            if (!post.comments) {
                post.comments_count = 0;
            }
            if (post.creation_date) {
                post.creation_date = dateConvert.fromBackToPost(post.creation_date);
            }
            post.avatar_url = userStore.user.avatar_url;

            if (post.attachments) {
                for (let i = 0; i < post.attachments.length; i++) {
                    const url = post.attachments[i];
                    let type = Router._getSearch(url).type;
                    if (type !== 'img') {
                        type = 'file';
                    }
                    post.attachments[i] = {url: Ajax.imgUrlConvert(url), id: i + 1, type: type}
                    if (Router._getSearch(url).filename) {
                        post.attachments[i].filename = Router._getSearch(url).filename;
                    }
                }
            }
            this.posts.unshift(post);
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

    /**
     * Метод, реализующий реакцию на изменение поста
     * @param {Text} text - текст поста
     * @param {Number} postId - id поста
     */
    async _editPost(text, postId) {
        const request = await Ajax.editPost(text, this.deleteAttachments, this.addAttachments, postId);

        postsStore.addAttachments = [];
        postsStore.deleteAttachments = [];

        if (request.status === 200) {
            let index = -1;
            for (let i = 0; i < this.posts.length; i++) {
                if (this.posts[i].id === Number(postId)) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.posts[index].text_content = text;
                this.posts[index].attachments = this.attachments;
            }
            this.attachments = [];
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

            this.posts.forEach((post) => {
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
            this.posts.forEach((post) => {
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
