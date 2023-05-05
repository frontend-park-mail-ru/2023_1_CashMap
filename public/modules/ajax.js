/**
 * класс, реализующий работу запроса
 */
class Ajax {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        this.backendHostname = '127.0.0.1';
        // this.backendHostname = '95.163.212.121';

        this.backendPort = '8080';
        this._backendUrl = 'http://' + this.backendHostname + ':' + this.backendPort;

        this._apiUrl = {
            signIn: '/auth/sign-in',
            signUp: '/auth/sign-up',
            signOut: '/auth/logout',
            check: '/auth/check',
            getProfile: '/api/user/profile',
            getProfileLink: '/api/user/profile/link/',
            editProfile: '/api/user/profile/edit',

            feed: '/api/feed',
            userPosts: '/api/posts/profile',
            userPostById: '/api/posts/id',
            communityPosts: '/api/posts/community',
            createPost: '/api/posts/create',
            deletePost: '/api/posts/delete',
            editPost: '/api/posts/edit',
            likePost: '/api/posts/like/set',
            dislikePost: '/api/posts/like/cancel',

            getFriends: '/api/user/friends',
            getNotFriends: '/api/user/rand',
            getUsers: '/api/user/all',
            getSub: '/api/user/sub',
            reject: '/api/user/reject',
            sub: '/api/user/sub',
            unsub: '/api/user/unsub',

            getGroups: '/api/group/self',
            getGroupInfo: '/api/group/link/',
            editGroup: '/api/group/link/',
            deleteGroup: '/api/group/link/',
            getManageGroups: '/api/group/manage',
            getNotGroups: '/api/group/hot',
            getPopularGroups: '/api/group/hot',
            createGroup: '/api/group/create',
            getGroupsSub: '/api/group/link/',
            GroupsSub: '/api/group/link/',
            GroupsUnsub: '/api/group/link/',

            chatCheck: '/api/im/chat/check',
            chatCreate: '/api/im/chat/create',
            getChats: '/api/im/chats',
            getMsg: '/api/im/messages',
            sendMsg: '/api/im/send',

            uploadImg: '/static/upload',
            deleteImg: '/static/delete',

            userSearch: '/api/user/search'
        }

        this._requestType = {
            GET: 'GET',
            POST: 'POST',
            DELETE: 'DELETE',
            PATCH: 'PATCH',
        }
    }

    /**
     * @private метод для работы запроса
     * @param {String} apiUrlType - url запроса
     * @param {String} requestType - тип запроса
     * @param {Object} body - тело запроса
     * @returns {Object} - тело ответа
     */
    _request(apiUrlType, requestType, body) {
        const requestUrl = this._backendUrl + apiUrlType;

        let a = {};
        a['X-Csrf-Token'] = localStorage.getItem('X-Csrf-Token');

        if (requestType === 'DELETE' || apiUrlType === '/api/im/chat/create' || apiUrlType === this._apiUrl.editGroup || apiUrlType === '/api/posts/like/set' || apiUrlType === '/api/posts/like/cancel' || apiUrlType === this._apiUrl.likePost || apiUrlType === this._apiUrl.dislikePost) {
            a['Content-Type'] = 'application/json';
        }

        return fetch(requestUrl, {
            method: requestType,
            mode: "cors",
            credentials: "include",
            headers: a,
            body,
        });
    }

    /**
     * метод, отправляющий запрос на вход в систему
     * @param {String} email - почта пользователя
     * @param {String} password - пароль пользователя
     * @returns {Object} - тело ответа
     */
    async signIn(email, password) {
        let body = {email: email, password: password};
        return this._request(this._apiUrl.signIn, this._requestType.POST, JSON.stringify({body}));
    }

    /**
     * метод, отправляющий запрос на регистрацию в системе
     * @param {String} firstName - имя пользователя
     * @param {String} lastName - фамилия пользователя
     * @param {String} email - почта пользователя
     * @param {String} password - пароль пользователя
     * @returns {Object} - тело ответа
     */
    async signUp(firstName, lastName, email, password) {
        let body = {first_name: firstName, last_name: lastName, email: email, password: password};
        return this._request(this._apiUrl.signUp, this._requestType.POST, JSON.stringify({body}));
    }

    /**
     * метод, отправляющий запрос на выход из системы
     * @returns {Object} - тело ответа
     */
    async signOut() {
        return this._request(this._apiUrl.signOut, this._requestType.POST);
    }

    /**
     * метод, отправляющий запрос на получение информации о пользователе
     * @param {String} link - ссылка пользователя
     * @returns {Object} - тело ответа
     */
    async getProfile(link) {
        if (link === undefined || link === null) {
            return this._request(this._apiUrl.getProfile, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.getProfileLink + link, this._requestType.GET);
        }
    }

    /**
     * метод, отправляющий запрос на редактирование пользователя
     * @param {String} avatar - аватарка пользователя
     * @param {String} firstName - имя пользователя
     * @param {String} lastName - фамилия пользователя
     * @param {String} email - почта пользователя
     * @param {String} city - город пользователя
     * @param {String} birthday - день рождения пользователя
     * @param {String} status - статус пользователя
     * @returns {Object} - тело ответа
     */
    async editProfile(avatar, firstName, lastName, bio, birthday, status) {
        let body = {
            avatar_url: avatar,
            first_name: firstName,
            last_name: lastName,
            bio: bio,
            birthday: birthday,
            status: status
        };
        return this._request(this._apiUrl.editProfile, this._requestType.PATCH, JSON.stringify({body}));
    }

    /**
     * метод, отправляющий запрос на проверку авторизации пользователя
     * @returns {Object} - тело ответа
     */
    async checkAuth() {
        return this._request(this._apiUrl.check, this._requestType.GET);
    }

    /**
     * метод, отправляющий запрос на получение постов
     * @param {String} userLink - ссылка на пользователя
     * @param {Number} count - количество постов для получения
     * @param {Date} lastPostDate - дата, после которой выбираются посты
     * @returns {Object} - тело ответа
     */
    async getPosts(userLink, count, lastPostDate) {
        if (lastPostDate) {
            return this._request(this._apiUrl.userPosts + `?owner_link=${userLink}&batch_size=${count}&last_post_date=${lastPostDate}`, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.userPosts + `?owner_link=${userLink}&batch_size=${count}`, this._requestType.GET);
        }
    }

    /**
     * метод, отправляющий запрос на получение постов
     * @param {String} userLink - ссылка на пользователя
     * @param {Number} count - количество постов для получения
     * @param {Date} lastPostDate - дата, после которой выбираются посты
     * @returns {Object} - тело ответа
     */
    async getPostsByCommunity(userLink, count, lastPostDate) {
        if (lastPostDate) {
            return this._request(this._apiUrl.communityPosts + `?community_link=${userLink}&batch_size=${count}&last_post_date=${lastPostDate}`, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.communityPosts + `?community_link=${userLink}&batch_size=${count}`, this._requestType.GET);
        }
    }

    /**
     * метод, отправляющий запрос на получение постов друзей
     * @param {Number} count - количество постов для получения
     * @param {Date} lastPostDate - дата, после которой выбираются посты
     * @returns {Object} - тело ответа
     */
    async getFriendsPosts(count, lastPostDate) {
        if (lastPostDate) {
            return this._request(this._apiUrl.feed + `?&batch_size=${count}&last_post_date=${lastPostDate}`, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.feed + `?&batch_size=${count}`, this._requestType.GET);
        }
    }

    async getPostById(id, count, lastPostDate) {
        if (lastPostDate) {
            return this._request(this._apiUrl.userPostById + `?post_id=${id}&batch_size=${count}&last_post_date=${lastPostDate}`, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.userPostById + `?post_id=${id}&batch_size=${count}`, this._requestType.GET);
        }
    }

    async createPost(data) {
        let formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        return this._request(this._apiUrl.createPost, this._requestType.POST, formData);
    }

    async editPost(text, post_id) {
        let formData = new FormData();

        formData.append("text", text);
        formData.append("post_id", post_id);

        return this._request(this._apiUrl.editPost, this._requestType.PATCH, formData);
    }

    async deletePost(post_id) {
        let body = {post_id: post_id};
        return this._request(this._apiUrl.deletePost, this._requestType.DELETE, JSON.stringify({body}));
    }

    async getFriends(link, count, offset = 0) {
        return this._request(this._apiUrl.getFriends + `?link=${link}&limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async getNotFriends(link, count, offset = 0) {
        return this._request(this._apiUrl.getNotFriends + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async getUsers(count, offset = 0) {
        return this._request(this._apiUrl.getUsers + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async getSub(type, link, count, offset = 0) {
        return this._request(this._apiUrl.getSub + `?type=${type}&link=${link}&limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async reject(link) {
        let body = {user_link: link};
        return this._request(this._apiUrl.reject, this._requestType.POST, JSON.stringify({body}));
    }

    async getGroups(count, offset= 0) {
        return this._request(this._apiUrl.getGroups + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async groupSub(link) {
        return this._request(this._apiUrl.GroupsSub + link + '/sub', this._requestType.POST);
    }

    async groupUnsub(link) {
        return this._request(this._apiUrl.GroupsUnsub + link + '/unsub', this._requestType.POST);
    }

    async getGroupInfo(link) {
        return this._request(this._apiUrl.getGroupInfo + link, this._requestType.GET);
    }

    async getGroupsSub(link, count, offset = 0) {
        return this._request(this._apiUrl.getGroupsSub + link + '/subs' + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async editGroup(link, title, info, avatar, privacy, hideOwner) {
        let body = {title: title, group_info: info, avatar_url: avatar, privacy: privacy, hide_owner: hideOwner};

        return this._request(this._apiUrl.editGroup + link, this._requestType.PATCH, JSON.stringify({body}));
    }

    async deleteGroup(link) {
        return this._request(this._apiUrl.deleteGroup + link, this._requestType.DELETE);
    }

    async getmanageGroups(count, offset = 0) {
        return this._request(this._apiUrl.getManageGroups + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async getNotGroups(count, offset = 0) {
        return this._request(this._apiUrl.getNotGroups + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async getPopularGroups(count, offset = 0) {
        return this._request(this._apiUrl.getPopularGroups + `?limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    /**
     * метод, отправляющий запрос на создание группы
     * @param {String} title - название группы
     * @param {String} info - информация о группе
     * @param {String} privacy - приватность
     * @param {Boolean} hideOwner - показывать ли создателя группы
     * @returns {Object} - тело ответа
     */
    async createGroup(title, info, privacy, hideOwner) {
        let body = {title: title, group_info: info, privacy: privacy, hide_owner: hideOwner};
        return this._request(this._apiUrl.createGroup, this._requestType.POST, JSON.stringify({body}));
    }

    async sub(link) {
        let body = {user_link: link};
        return this._request(this._apiUrl.sub, this._requestType.POST, JSON.stringify({body}));
    }

    async unsub(link) {
        let body = {user_link: link};
        return this._request(this._apiUrl.unsub, this._requestType.POST, JSON.stringify({body}));
    }

    async getChats(count = 0, lastPostDate = 0) {
        return this._request(this._apiUrl.getChats + `?batch_size=${count}&offset=${lastPostDate}`, this._requestType.GET);
    }

    async getChatsMsg(chatId, count, lastPostDate) {
        if (lastPostDate) {
            return this._request(this._apiUrl.getMsg + `?chat_id=${chatId}&batch_size=${count}&last_post_date=${lastPostDate}`, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.getMsg + `?chat_id=${chatId}&batch_size=${count}`, this._requestType.GET);
        }
    }

    async chatCheck(link) {
        return this._request(this._apiUrl.chatCheck + `?user_link=${link}`, this._requestType.GET);
    }

    async msgSend(id, text) {
        let body = {chat_id: Number(id), text_content: text};
        return this._request(this._apiUrl.sendMsg, this._requestType.POST, JSON.stringify({body}));
    }

    async chatCreate(users) {
        let body = {user_links: [users]};
        return this._request(this._apiUrl.chatCreate, this._requestType.POST, JSON.stringify({body}));
    }

    async uploadImg(data) {
        let formData = new FormData();
        formData.append("attachments", data);

        return this._request(this._apiUrl.uploadImg, this._requestType.POST, formData);
    }

    async getGlobalSearchResult(searchText, count, offset) {
        let request_url = this._apiUrl.userSearch + `?search_query=${searchText}&batch_size=${count}&offset=${offset}`
        return this._request(request_url, this._requestType.GET);
    }

    /**
     * Метод отправки данных по лайку на сервер
     * @param id - id поста
     * @returns {Promise<Response>}
     */
    async likePost(id) {
        let body = {post_id: id};
        return this._request(this._apiUrl.likePost, this._requestType.POST, JSON.stringify({body}));
    }

    /**
     * Метод отправки данных по дизлайку на сервер
     * @param id - id поста
     * @returns {Promise<Response>}
     */
    async dislikePost(id) {
        let body = {post_id: id};
        return this._request(this._apiUrl.dislikePost, this._requestType.POST, JSON.stringify({body}));
    }
}

export default new Ajax();
