import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {headerConst} from "../static/htmlConst.js";
import userStore from "./userStore.js";
import groupsStore from "./groupsStore.js";
import ProfileView from "../views/profileView.js";

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

        this.curPost = null;

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
                    post.canDelete = post.canEdit = false;
                    if (post.author_link === userStore.user.user_link) {
                        post.canDelete = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore.user.user_link) {
                        post.canDelete = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${ post.owner_info.avatar_url }`;
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.userProfile.avatar_url;

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

                    post.canDelete = post.canEdit = false;
                    if (post.author_link === userStore.user.user_link) {
                        post.canDelete = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore.user.user_link) {
                        post.canDelete = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${ post.owner_info.avatar_url }`;
                    }
                    if (post.community_info) {
                        if (!post.community_info.avatar_url) {
                            post.community_info.avatar_url = headerConst.avatarDefault;
                        } else {
                            post.community_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${ post.community_info.avatar_url }`;
                        }
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore.user.avatar_url;

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

            console.log(response.body)
            response.body.posts.forEach((post) => {

                post.canDelete = post.canEdit = false;
                groupsStore.curGroup.management.forEach((user) => {
                    if (user.link === userStore.user.user_link) {
                        post.canDelete = post.canEdit = true;
                    }
                });

                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.owner_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${ post.owner_info.avatar_url }`;
                }
                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.community_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${ post.community_info.avatar_url }`;
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

            this.posts = response.body.posts;
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
            const post = response.body.posts[0];

            if (post.owner_info) {
                post.canDelete = post.canEdit = false;
                if (post.author_link === userStore.user.user_link) {
                    post.canDelete = post.canEdit = true;
                } else if (post.owner_info.user_link === userStore.user.user_link) {
                    post.canDelete = true;
                }

                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.owner_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${post.owner_info.avatar_url}`;
                }
            }

            if (post.community_info) {
                post.canDelete = post.canEdit = false;
                groupsStore.curGroup.management.forEach((user) => {
                    if (user.link === userStore.user.user_link) {
                        post.canDelete = post.canEdit = true;
                    }
                });

                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.community_info.avatar_url = `http://${Ajax.backendHostname}:${Ajax.backendPort}/${post.community_info.avatar_url}`;
                }
            }

            if (!post.comments) {
                post.comments_count = 0;
            }
            if (post.creation_date) {
                const date = new Date(post.creation_date);
                post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
            }
            post.avatar_url = userStore.user.avatar_url;

            if (ProfileView.curPage) {
                this.posts.unshift(post);
            }
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
        const request = await Ajax.editPost(text, postId);

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
