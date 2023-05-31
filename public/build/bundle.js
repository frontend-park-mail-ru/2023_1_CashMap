'use strict';

/**
 * класс роутера, который отсеживает переход по url, и вызывает соответствующие им view
 */
class Router {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        this.currentPage = null;
        this._pages = {};
        this.rootElement = document.getElementById('root');
    }

    /**
     * метод для регистрации шаблона url
     * @param {string} url - url
     * @param {BaseView} view - view url
     */
    registerPage(url, view) {
        this._pages[url] = view;
    }

    /**
     * метод, выполняющий переход по относительному url
     * @param {String} winUrl - url на который следует перейти
     * @param {Boolean} replace - true: заменить текущую запись, false: добавить новую
     * (по умолчанию: false)
     */
    go(winUrl, replace = true) {
        const url = this._getUrl(winUrl);
        const search = this._getSearch(winUrl);
        if (this.currentPage) {
            this.currentPage.remove();
            this.currentPage.curPage = false;
        }



        if (this._pages[url]) {
            this.currentPage = this._pages[url];
            this.currentPage.curPage = true;
            this.currentPage.showPage(search);

            if (window.location.pathname + window.location.search !== winUrl) {
                if (replace) {
                    window.history.replaceState(null, null, winUrl);
                } else {
                    window.history.pushState(null, null, winUrl);
                }
            }

        } else {
            this._pages['/404'].showPage();
        }
    }

    /**
     * метод, осуществляющий переход на предыдущую страницу
     */
    goBack() {
        window.history.back();
    }

    /**
     * метод инициализации
     */
    init() {
        this.go(window.location.pathname + window.location.search, true);

        window.addEventListener("popstate", () => {
            this.go(window.location.pathname + window.location.search, false);
        });
    }

    _getUrl(url) {
        const urlObject = new URL(url, window.location.origin);
        return urlObject.pathname === '/' ? '/' : urlObject.pathname.replace(/\/$/, '');
    }

    _getSearch(url) {
        const urlObject = new URL(url, window.location.origin);
        return Object.fromEntries(urlObject.searchParams);
    }
}

var Router$1 = new Router();

/**
 * класс, реализующий диспетчер
 */
class Dispatcher {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        this._callbacks = [];
        this._isDispatching = false;
        this._pendingPayload = null;
    }

    /**
     * метод, регистрирующий новый коллбек в диспетчере
     * @param {Function} callback функция-коллбек
     */
    register(callback) {
        this._callbacks.push(callback);
    }

    /**
     * метод, удаляющий регистрацию коллбека
     * @param {int} id
     */
    unregister(id) {
        delete this._callbacks[id];
    }

    /**
     * метод, организующий рассылку
     * @param {Object} payload
     */
    dispatch(payload) {
        if (this._isDispatching) {
            throw new Error("Cannot dispatch in the middle of a dispatch");
        }
        this._isDispatching = true;
        this._pendingPayload = payload;
        try {
            this._callbacks.forEach((callback) => {
                if (callback) {
                    callback(this._pendingPayload);
                }
            });
        } finally {
            this._pendingPayload = null;
            this._isDispatching = false;
        }
    }
}

var Dispatcher$1 = new Dispatcher();

/**
 * класс, реализующий работу запроса
 */
class Ajax {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        this.beckendStatus = 'local';
        //this.beckendStatus = 'global';

        if (this.beckendStatus === 'global') {
            this.backendHostname = 'depeche.su';
            this._backendUrl = 'https://' + this.backendHostname;
        } else {
            this.backendHostname = '127.0.0.1';
            this.backendPort = '8080';
            this.backendStaticPort = '8082';
            this._backendUrl = 'http://' + this.backendHostname + ':' + this.backendPort;
            this._backendStaticUrl = 'http://' + this.backendHostname + ':' + this.backendStaticPort;
        }

        this._staticUrl = 'https://' + this.backendHostname;

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
            isFriend: '/api/user/status',
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

            uploadImg: '/static-service/upload',
            deleteImg: '/static-service/delete',

            downloadImg: '/static-service/download',

            userSearch: '/api/user/search',

            getComments: '/api/comment/post/',
            getComment: '/api/comment/',
            createComment: '/api/comment/create',
            deleteComment: '/api/comment/delete/',
            editComment: '/api/comment/edit'
        };

        this._requestType = {
            GET: 'GET',
            POST: 'POST',
            DELETE: 'DELETE',
            PATCH: 'PATCH',
        };
    }

    /**
     * @private метод для работы запроса
     * @param {String} apiUrlType - url запроса
     * @param {String} requestType - тип запроса
     * @param {Object} body - тело запроса
     * @param {Object} backendUrl - api  hostname
     * @returns {Object} - тело ответа
     */
    _request(apiUrlType, requestType, body) {
        let requestUrl = null;
        if (this.beckendStatus === 'local' && apiUrlType === this._apiUrl.uploadImg) {
            requestUrl = this._backendStaticUrl + apiUrlType;
        } else {
            requestUrl = this._backendUrl + apiUrlType;
        }

        let a = {};
        a['X-Csrf-Token'] = localStorage.getItem('X-Csrf-Token');

        if (requestType === 'DELETE' || apiUrlType === '/api/im/chat/create' || apiUrlType === this._apiUrl.editGroup || apiUrlType === this._apiUrl.sendMsg || apiUrlType === this._apiUrl.editPost || apiUrlType === '/api/posts/like/set' || apiUrlType === '/api/posts/like/cancel' || apiUrlType === this._apiUrl.likePost || apiUrlType === this._apiUrl.dislikePost) {
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
        if (!link) {
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
        const body = {
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
        let body = data;
        return this._request(this._apiUrl.createPost, this._requestType.POST,  JSON.stringify({body}));
    }

    async editPost(text, deleteAtt, addAtt, post_id) {
        const body = {text: text, post_id: Number(post_id), attachments: {deleted: deleteAtt, added: addAtt}};

        return this._request(this._apiUrl.editPost, this._requestType.PATCH, JSON.stringify(body));
    }

    async deletePost(post_id) {
        const body = {post_id: post_id};
        return this._request(this._apiUrl.deletePost, this._requestType.DELETE, JSON.stringify({body}));
    }

    async getFriends(link, count, offset = 0) {
        return this._request(this._apiUrl.getFriends + `?link=${link}&limit=${count}&offset=${offset}`, this._requestType.GET);
    }

    async isFriend(link) {
        return this._request(this._apiUrl.isFriend + `?link=${link}`, this._requestType.GET);
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
        const body = {user_link: link};
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
        const body = {title: title, group_info: info, avatar_url: avatar, privacy: privacy, hide_owner: hideOwner};

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
        const body = {title: title, group_info: info, privacy: privacy, hide_owner: hideOwner};
        return this._request(this._apiUrl.createGroup, this._requestType.POST, JSON.stringify({body}));
    }

    async sub(link) {
        const body = {user_link: link};
        return this._request(this._apiUrl.sub, this._requestType.POST, JSON.stringify({body}));
    }

    async unsub(link) {
        const body = {user_link: link};
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

    async msgSend(id, text, attachments) {
        const body = {chat_id: Number(id), text_content: text, attachments: attachments};
        return this._request(this._apiUrl.sendMsg, this._requestType.POST, JSON.stringify({body}));
    }

    async chatCreate(users) {
        const body = {user_links: [users]};
        return this._request(this._apiUrl.chatCreate, this._requestType.POST, JSON.stringify({body}));
    }

    async uploadImg(data, filename) {
        let formData = new FormData();
        formData.append("attachments", data);

        if (filename) {
            return this._request(this._apiUrl.uploadImg + `?filename=${filename}`, this._requestType.POST, formData, this._staticUrl);
        } else {
            return this._request(this._apiUrl.uploadImg, this._requestType.POST, formData, this._staticUrl);
        }
    }

    async getGlobalSearchResult(searchText, count, offset) {
        let request_url = this._apiUrl.userSearch + `?search_query=${searchText}&batch_size=${count}&offset=${offset}`;
        return this._request(request_url, this._requestType.GET);
    }

    /**
     * Метод отправки данных по лайку на сервер
     * @param id - id поста
     * @returns {Promise<Response>}
     */
    async likePost(id) {
        const body = {post_id: id};
        return this._request(this._apiUrl.likePost, this._requestType.POST, JSON.stringify({body}));
    }

    /**
     * Метод отправки данных по дизлайку на сервер
     * @param id - id поста
     * @returns {Promise<Response>}
     */
    async dislikePost(id) {
        const body = {post_id: id};
        return this._request(this._apiUrl.dislikePost, this._requestType.POST, JSON.stringify({body}));
    }

    imgUrlConvert(avatar_url) {
        if (this.beckendStatus === 'local') {
            return `http://${this.backendHostname}:${this.backendStaticPort}/${ avatar_url }`;
        } else {
            return `https://${this.backendHostname}/${avatar_url}`;
        }
    }

    imgUrlBackConvert(url) {
        if (this.beckendStatus === 'local') {
            return  url.replace(`http://${this.backendHostname}:${this.backendStaticPort}/`, '')
        } else {
            return  url.replace(`https://${this.backendHostname}/`, '')
        }
    }

    async getCommentsByPostId(postId, count, lastCommentDate) {
        let lastCommentDateQuery = lastCommentDate !== undefined && lastCommentDate !== null ? `last_comment_date=${lastCommentDate}` : "";
        let countQuery = count !== undefined && count !== null ? `batch_size=${count}` : "";
        console.log(this._apiUrl.getComments + postId + `?${lastCommentDateQuery}&${countQuery}`);
        return this._request(this._apiUrl.getComments + postId + `?${lastCommentDateQuery}&${countQuery}`, this._requestType.GET);
    }

    async getCommentById(id) {
        return this._request(this._apiUrl.getComment + id, this._requestType.GET);
    }

    async createComment(postId, replyReceiver, text) {
        const body = {post_id: postId, reply_to: replyReceiver, text: text};
        console.log(JSON.stringify({body}));
        return this._request(this._apiUrl.createComment, this._requestType.POST, JSON.stringify({body}));
    }

    async editComment(id, text) {
        const body = {id: id,  text: text};
        return this._request(this._apiUrl.editComment, this._requestType.PATCH, JSON.stringify({body}));
    }

    async deleteComment(id) {
        return this._request(this._apiUrl.deleteComment + id, this._requestType.POST);
    }
}

var Ajax$1 = new Ajax();

const activeColor = '#B95DD9';

const maxTextStrings = 3;
const maxTextLength = 150;

const maxBirthday = '2017-01-01';

const groupAvatarDefault = 'static/img/post_icons/profile_image.svg';

const sideBarConst = {
    logoImgPath: 'static/img/logo.svg',
    logoText: 'Depeche',
    menuItemList: [
        {text: 'Моя страница', jsId: 'js-side-bar-my-page', iconPath: 'static/img/nav_icons/profile.svg', hoveredIconPath: 'static/img/nav_icons/profile_hover.svg', notifies: 1},
        {text: 'Новости', jsId: 'js-side-bar-news', iconPath: 'static/img/nav_icons/news.svg', hoveredIconPath: 'static/img/nav_icons/news_hover.svg', notifies: 0},
        {text: 'Мессенджер', jsId: 'js-side-bar-msg', iconPath: 'static/img/nav_icons/messenger.svg', hoveredIconPath: 'static/img/nav_icons/messenger_hover.svg', notifies: 7},
        {text: 'Фотографии', jsId: 'js-side-bar-photo', iconPath: 'static/img/nav_icons/photos.svg', hoveredIconPath: 'static/img/nav_icons/photos_hover.svg', notifies: 0},
        {text: 'Друзья', jsId: 'js-side-bar-friends', iconPath: 'static/img/nav_icons/friends.svg', hoveredIconPath: 'static/img/nav_icons/friends_hover.svg', notifies: 0},
        {text: 'Сообщества', jsId: 'js-side-bar-groups', iconPath: 'static/img/nav_icons/groups.svg', hoveredIconPath: 'static/img/nav_icons/groups_hover.svg', notifies: 0},
        {text: 'Закладки', jsId: 'js-side-bar-bookmarks', iconPath: 'static/img/nav_icons/bookmarks.svg', hoveredIconPath: 'static/img/nav_icons/bookmarks_hover.svg', notifies: 11}]
};

const headerConst = {
    avatarDefault: 'static/img/post_icons/profile_image.svg',
    exitButton: { text: 'Выход', jsId: 'js-exit-btn', iconPath: 'static/img/exit.svg', hoveredIconPath: 'static/img/exit_hover.svg'},
    settingsButton: { text: 'Настройки', jsId: 'js-settings-btn', iconPath: 'static/img/settings.svg', hoveredIconPath: 'static/img/settings_hover.svg'},
};

const logoDataSignIn = {
    logoImgPath: 'static/img/logo.svg',
    backgroundImgPath: 'static/img/background_right.svg',
    logoText: 'Depeche',
    logoTagline: 'Твоя социальная сеть',
};
const logoDataSignUp = {
    logoImgPath: 'static/img/logo.svg',
    backgroundImgPath: 'static/img/background_left.svg',
    logoText: 'Depeche',
    logoTagline: 'Твоя социальная сеть',
};

const signInData = {
    title: 'Авторизация',
    inputFields: [
        { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
        { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'}],
    buttonInfo: { text: 'Войти', jsId: 'js-sign-in-btn'},
    errorInfo: { jsId: 'js-sign-in-error' },
    link: { text:'У вас еще нет аккаунта? Зарегистрироваться', jsId: 'js-create-account-btn'},
    linkInfo: 'После успешной регистрации вы получите доступ ко всем функциям Depeche',
};

const signUpData = {
    title: 'Регистрация',
    inputFields: [
        { help: 'Имя', type: 'text', jsIdInput: 'js-first-name-input', jsIdError: 'js-first-name-error'},
        { help: 'Фамилия', type: 'text', jsIdInput: 'js-last-name-input', jsIdError: 'js-last-name-error'},
        { help: 'Электронная почта', type: 'email', jsIdInput: 'js-email-input', jsIdError: 'js-email-error'},
        { help: 'Пароль', type: 'password', jsIdInput: 'js-password-input', jsIdError: 'js-password-error'},
        { help: 'Повторите пароль', type: 'password', jsIdInput: 'js-repeat-password-input', jsIdError: 'js-repeat-password-error'}],
    buttonInfo: { text: 'Зарегистрироваться', jsId: 'js-sign-up-btn'},
    errorInfo: { jsId: 'js-sign-up-error' },
    link: { text:'У вас уже есть аккаунт? Войти', jsId: 'js-have-account-btn'},
};

const settingsConst = {
  avatar_url: "static/img/post_icons/profile_image.svg",
  inputFields:
      [
      { help: 'Имя',
        data: '',
        type: 'text',
        jsIdInput: 'js-first-name-input',
        jsIdError: 'js-first-name-error'},
      { help: 'Фамилия',
        data: '',
        type: 'text',
        jsIdInput: 'js-last-name-input',
        jsIdError: 'js-last-name-error'},
      { help: 'О себе',
        data: '',
        type: 'text',
        jsIdInput: 'js-bio-input',
        jsIdError: 'js-bio-error'},
      { help: 'Дата рождения',
        data: '',
        type: 'date',
        jsIdInput: 'js-birthday-input',
        jsIdError: 'js-birthday-error'},
      { help: 'Статус',
        data: '',
        type: 'text',
        jsIdInput: 'js-status-input',
        jsIdError: 'js-status-error'}
      ],
  buttonInfo: { text: 'Сохранить',
      jsId: 'js-settings-save-btn'},
  errorInfo: { jsId: 'js-sign-in-error'},
  menuInfo: [
      {text: 'Основные', jsId: 'js-menu-main'},
      {text: 'Безопасность', jsId: 'js-menu-safety'}]
};

const safetyConst = {
  header: 'Смена пароля',
  inputFields:
      [
      { help: 'Введите старый пароль',
        type: 'text',
        jsIdInput: 'js-password-input',
        jsIdError: 'js-password-error'},
      { help: 'Введите новый пароль',
        type: 'text',
        jsIdInput: 'js-new-password-input',
        jsIdError: 'js-new-password-error'},
      { help: 'Повторите пароль',
        type: 'email',
        jsIdInput: 'js-repeat-password-input',
        jsIdError: 'js-repeat-password-error'},
      ],
  buttonInfo: { text: 'Изменить пароль',
      jsId: 'js-change-password-btn'},
  menuInfo: [
      {text: 'Основные', jsId: 'js-menu-main'},
      {text: 'Безопасность', jsId: 'js-menu-safety'}]
};

const friendsMenuInfo = [
  {text: 'Друзья', jsId: 'js-menu-friends'},
  {text: 'Подписчики', jsId: 'js-menu-subscribers'},
  {text: 'Подписки', jsId: 'js-menu-subscriptions'},
  {text: 'Поиск друзей', jsId: 'js-menu-find-friends'}];

const searchDropdownConst = {
    emptyQueryTitle: 'Ваш запрос не дал результатов',
    showMoreTitle: 'Показать все результаты',
    peopleSectionTitle: 'Люди',
    communitySectionTitle: 'Сообщества',
    sendMessageIconPath: 'static/img/messenger.svg',
    sendMessageHoveredIconPath: 'static/img/messenger_hover.svg',
    showMoreIconPath: 'static/img/show_all.svg',
    showMoreIconPathHover: 'static/img/show_all_hover.svg',
};

const groupsConst = {
  menuInfo: [
    {text: 'Мои сообщества', jsId: 'js-menu-groups'},
    {text: 'Управление', jsId: 'js-menu-manage-groups'},
    {text: 'Поиск сообществ', jsId: 'js-menu-find-groups'},
    {text: 'Популярные сообщества', jsId: 'js-menu-popular-groups'}],
  buttonInfo: { text: 'Создать сообщество',
      jsId: 'js-create-group-btn'}
  };

const NewGroupConst = {
  inputInfo:
      { help: 'Название',
        type: 'text',
        jsIdInput: 'js-title-input',
        jsIdError: 'js-title-error'},
        buttonInfo: {text: 'Создать сообщество',
                    jsId: 'js-add-group-btn'},
};

const settingsGroupConst = {
  avatar_url: "static/img/post_icons/group_image.svg",
  inputInfo: 
  { help: 'Название',
    data: '',
    type: 'text',
    jsIdInput: 'js-title-input',
    jsIdError: 'js-title-error'},
  info: '',
  type: '',
  showAuthor: '',
  buttonInfo: { text: 'Сохранить',
      jsId: 'js-settings-save-btn'},
  menuInfo: [
      {text: 'Настройки', jsId: 'js-menu-main'},
      {text: 'Подписчики', jsId: 'js-menu-subscribers'},
      {text: 'Заявки', jsId: 'js-menu-requests'}],
  errorInfo: { jsId: 'js-sign-in-error'},
  buttonDelete: { text: 'Удалить группу',
      jsId: 'js-delete-group-btn'},
  deleteGroupData : { text: 'Да',
      jsId: 'js-group-delete-btn'},
};

/**
 * action-ы для работы с пользователем 
 */
const actionUser = {
    /**
     * action для входа пользователя в систему
     * @param {*} data - данные пользователя
     */
    signIn(data) {
        Dispatcher$1.dispatch({
            actionName: 'signIn',
            data: data,
        });
    },
    /**
     * action для резистрации пользователя в системе
     * @param {*} data - данные пользователя
     */
    signUp(data) {
        Dispatcher$1.dispatch({
            actionName: 'signUp',
            data: data,
        });
    },
    /**
     * action для выхода пользователя из системы
     */
    signOut() {
        Dispatcher$1.dispatch({
            actionName: 'signOut',
        });
    },
    /**
     * action для получения информации о пользователе
     * @param {*} link - ссылка на пользователя
     */
    getProfile(callback, link) {
        Dispatcher$1.dispatch({
            actionName: 'getProfile',
            callback,
            link,
        });
    },
    /**
     * action для проверки авторизации пользователя
     */
    checkAuth(callback) {
        Dispatcher$1.dispatch({
            actionName: 'checkAuth',
            callback,
        });
    },
    /**
     * action для редактирования пользователя в системе
     * @param {*} data - данные пользователя
     */
    editProfile(data) {
        Dispatcher$1.dispatch({
            actionName: 'editProfile',
            data: data,
        });
    },
};

/**
 * класс, хранящий информацию о группах
 */
class groupsStore {
    /**
     * @constructor
     * конструктор класса
     */
    constructor() {
        this._callbacks = [];

        this.groups = [];
        this.manageGroups = [];
        this.findGroups = [];
        this.popularGroups = [];

        this.curGroup = {};

        this.editMsg = '';
        this.editStatus = null;

        this.error = "";

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'getGroups':
                await this._getGroups(action.count, action.offset);
                break;
            case 'getManageGroups':
                await this._getManageGroups(action.count, action.offset);
                break;
            case 'getNotGroups':
                await this._getNotGroups(action.count, action.offset);
                break;
            case 'getPopularGroups':
                await this._getPopularGroups(action.count, action.offset);
                break;
            case 'getGroupInfo':
                await this._getGroupInfo(action.callback, action.link);
                break;
            case 'createGroup':
                await this._createGroup(action.data);
                break;
            case 'editGroup':
                await this._editGroup(action.data);
                break;
            case 'deleteGroup':
                await this._deleteGroup(action.link);
                break;
            case 'getGroupsSub':
                await this._getGroupsSub(action.link, action.count, action.offset);
                break;
            case 'groupSub':
                await this._groupSub(action.link);
                break;
            case 'groupUnsub':
                await this._groupUnsub(action.link);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка групп
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getGroups(count, offset) {
        const request = await Ajax$1.getGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isGroup = true;
                if (!group.avatar_url) {
                    group.avatar_url = groupAvatarDefault;
                } else {
                    group.avatar_url = Ajax$1.imgUrlConvert(group.avatar_url);
                }
                if (group.privacy === 'open') {
                    group.privacy = 'Открытая группа';
                } else {
                    group.privacy = 'Закрытая группа';
                }
            });

            this.groups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение групп, созданных пользователем
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getManageGroups(count, offset) {
        const request = await Ajax$1.getmanageGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isUserGroup = true;
                if (!group.avatar_url) {
                    group.avatar_url = groupAvatarDefault;
                } else {
                    group.avatar_url = Ajax$1.imgUrlConvert(group.avatar_url);
                }
                if (group.privacy === 'open') {
                    group.privacy = 'Открытая группа';
                } else {
                    group.privacy = 'Закрытая группа';
                }
            });

            this.manageGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение групп, на которые не подписан пользователь
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getNotGroups(count, offset) {
        const request = await Ajax$1.getNotGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isNotUserGroup = true;
                if (!group.avatar_url) {
                    group.avatar_url = groupAvatarDefault;
                } else {
                    group.avatar_url = Ajax$1.imgUrlConvert(group.avatar_url);
                }
                if (group.privacy === 'open') {
                    group.privacy = 'Открытая группа';
                } else {
                    group.privacy = 'Закрытая группа';
                }
            });

            this.findGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение популярных групп
     * @param {Number} count - количество получаемых групп
     * @param {Number} offset - смещение
     */
    async _getPopularGroups(count, offset) {
        const request = await Ajax$1.getPopularGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isPopularGroup = true;
                if (!group.avatar_url) {
                    group.avatar_url = groupAvatarDefault;
                } else {
                    group.avatar_url = Ajax$1.imgUrlConvert(group.avatar_url);
                }
                if (group.privacy === 'open') {
                    group.privacy = 'Открытая группа';
                } else {
                    group.privacy = 'Закрытая группа';
                }
            });

            this.popularGroups = response.body.groups;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий получение информации о группе
     * @param {Object} link - данные группы
     */
    async _getGroupInfo(callback, link) {
        const request = await Ajax$1.getGroupInfo(link);
        const response = await request.json();

        if (request.status === 200) {
            this.curGroup = response.body.group_info;
            this.curGroup.isSub = response.body.is_sub;
            this.curGroup.isAdmin = response.body.is_admin;

            if (!this.curGroup.avatar_url) {
                this.curGroup.avatar_url = groupAvatarDefault;
            } else {
                this.curGroup.avatar_url = Ajax$1.imgUrlConvert(this.curGroup.avatar_url);
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getGroup error');
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий получение подписчиков группы
     * @param {Object} link - данные группы
     * @param {Object} count - данные группы
     * @param {Object} offset - данные группы
     */
    async _getGroupsSub(link, count, offset) {
        const request = await Ajax$1.getGroupsSub(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.profiles.forEach((user) => {
                if (!user.avatar_url) {
                    user.avatar_url = headerConst.avatarDefault;
                } else {
                    user.avatar_url = Ajax$1.imgUrlConvert(user.avatar_url);
                }
            });
            this.curGroup.subList = response.body.profiles;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getGroup error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на создание группы
     * @param {Object} data - данные группы
     */
    async _createGroup(data) {
        const request = await Ajax$1.createGroup(data.title, data.info, data.privacy, data.hideOwner);

        if (request.status === 200) {
            const group = {};

            group.title = data.title;
            group.info = data.info;
            group.privacy = data.privacy;
            group.hideOwner = data.hideOwner;

            this.manageGroups.push(group);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status === 400) {
            this.error = request.body.message;
        } else {
            alert('createGroup error');
        }

        this._refreshStore();
    }
    /**
     * Метод, реализующий реакцию на изменение информации о группе
     * @param {Object} data - данные группы
     */
    async _editGroup(data) {
        const request = await Ajax$1.editGroup(data.link, data.title, data.info, data.avatar, data.privacy, data.hideOwner);
        if (request.status === 200) {

            if (data.avatar) {
                this.curGroup.avatar_url = this.curGroup.avatar_url = Ajax$1.imgUrlConvert(data.avatar);
            }
            this.curGroup.link = data.link;
            this.curGroup.title = data.title;
            this.curGroup.info = data.info;
            this.curGroup.privacy = data.privacy;
            this.curGroup.hideOwner = data.hideOwner;

            this.editMsg = 'Данные профиля успешно обновлены';
            this.editStatus = true;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            this.editMsg = 'Ошибка сервера';
            this.editStatus = false;
        }

        this._refreshStore();
    }

    async _deleteGroup(link) {
        const request = await Ajax$1.deleteGroup(link);
        if (request.status === 200) {
            for (let i = 0; i < this.manageGroups.length; i++) {
                if (this.manageGroups[i].link === link) {
                    this.manageGroups.slice(i, 1);
                }
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('editGroup error');
        }

        this._refreshStore();
    }

    async _groupSub(link) {
        const request = await Ajax$1.groupSub(link);
        if (request.status === 200) {
            this.curGroup.isSub = true;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('groupSub error');
        }

        this._refreshStore();
    }

    async _groupUnsub(link) {
        const request = await Ajax$1.groupUnsub(link);
        if (request.status === 200) {
            this.curGroup.isSub = false;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('groupUnsub error');
        }

        this._refreshStore();
    }
}

var groupsStore$1 = new groupsStore();

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

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
        const request = await Ajax$1.getPosts(userLink, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.posts) {
                response.body.posts.forEach((post) => {
                    post.canDelite = post.canEdit = false;
                    if (post.author_link === userStore$1.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore$1.user.user_link) {
                        post.canDelite = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = Ajax$1.imgUrlConvert(post.owner_info.avatar_url);
                    }
                    if (!post.comments) {
                        post.comments_count = 0;
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore$1.userProfile.avatar_url;

                    if (post.attachments) {
                        for (let i = 0; i < post.attachments.length; i++) {
                            const url = post.attachments[i];
                            let type = Router$1._getSearch(url).type;
                            if (type !== 'img') {
                                type = 'file';
                            }
                            post.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                            if (Router$1._getSearch(url).filename) {
                                post.attachments[i].filename = Router$1._getSearch(url).filename;
                            }
                        }
                    }
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
        const request = await Ajax$1.getFriendsPosts(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.posts) {
                response.body.posts.forEach((post) => {

                    post.canDelite = post.canEdit = false;
                    if (post.author_link === userStore$1.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    } else if (post.owner_info.user_link === userStore$1.user.user_link) {
                        post.canDelite = true;
                    }

                    if (!post.owner_info.avatar_url) {
                        post.owner_info.avatar_url = headerConst.avatarDefault;
                    } else {
                        post.owner_info.avatar_url = Ajax$1.imgUrlConvert(post.owner_info.avatar_url);
                    }
                    if (post.community_info) {
                        if (!post.community_info.avatar_url) {
                            post.community_info.avatar_url = headerConst.avatarDefault;
                        } else {
                            post.community_info.avatar_url = Ajax$1.imgUrlConvert(post.community_info.avatar_url);
                        }
                    }
                    if (post.creation_date) {
                        const date = new Date(post.creation_date);
                        post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                    }
                    post.avatar_url = userStore$1.user.avatar_url;

                    if (post.attachments) {
                        for (let i = 0; i < post.attachments.length; i++) {
                            const url = post.attachments[i];
                            let type = Router$1._getSearch(url).type;
                            if (type !== 'img') {
                                type = 'file';
                            }
                            post.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                            if (Router$1._getSearch(url).filename) {
                                post.attachments[i].filename = Router$1._getSearch(url).filename;
                            }
                        }
                    }
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

    async getCommentsByPostId(postID, count, lastPostDate) {
        const request = await Ajax$1.getCommentsByPostId(postID, count, lastPostDate);
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
            });


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
        const request = await Ajax$1.getCommentById(id);

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
        const request = await Ajax$1.createComment(postID, replyReceiver, text);

        if (request.status === 200) {
            await request.json();

            for (let post of this.posts) {
                if (post.id === postID) {
                    post.comments_amount += 1;
                }
            }

            if (this.comments.get(postID) !== undefined) {
                this.comments.delete(postID);
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
        const request = await Ajax$1.editComment(id, text);

        if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status !== 200) {
            alert('edit comment error');
        }

        this._refreshStore();
    }

    async deleteComment(id) {
        const request = await Ajax$1.deleteComment(id);

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
        const request = await Ajax$1.getPostById(id, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.posts[0].attachments) {
                for (let i = 0; i < response.body.posts[0].attachments.length; i++) {
                    const url = response.body.posts[0].attachments[i];
                    let type = Router$1._getSearch(url).type;
                    if (type !== 'img') {
                        type = 'file';
                    }
                    response.body.posts[0].attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                    if (Router$1._getSearch(url).filename) {
                        response.body.posts[0].attachments[i].filename = Router$1._getSearch(url).filename;
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

    async _getPostsByCommunity(community_link, count, lastPostDate) {
        const request = await Ajax$1.getPostsByCommunity(community_link, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();

            this.posts = [];
            console.log(response.body);
            response.body.posts.forEach((post) => {

                post.canDelite = post.canEdit = false;
                groupsStore$1.curGroup.management.forEach((user) => {
                    if (user.link === userStore$1.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    }
                });

                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.owner_info.avatar_url = Ajax$1.imgUrlConvert(post.owner_info.avatar_url);
                }
                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.community_info.avatar_url = Ajax$1.imgUrlConvert(post.community_info.avatar_url);
                }

                if (!post.comments) {
                    post.comments_count = 0;
                }
                if (post.creation_date) {
                    const date = new Date(post.creation_date);
                    post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
                }
                post.avatar_url = userStore$1.user.avatar_url;
                if (post.attachments) {
                    for (let i = 0; i < post.attachments.length; i++) {
                        const url = post.attachments[i];
                        let type = Router$1._getSearch(url).type;
                        if (type !== 'img') {
                            type = 'file';
                        }
                        post.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                        if (Router$1._getSearch(url).filename) {
                            post.attachments[i].filename = Router$1._getSearch(url).filename;
                        }
                    }
                }
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
        data['attachments'] = [];
        this.deleteAttachments = [];
        this.addAttachments = [];
        this.attachments.forEach((img) => {
            if (img.type === 'file') {
                data.attachments.push(Ajax$1.imgUrlBackConvert(img.url) + `&filename=${img.filename}`);
            } else {
                data.attachments.push(Ajax$1.imgUrlBackConvert(img.url));
            }
        });
        this.attachments = [];
        const request = await Ajax$1.createPost(data);

        if (request.status === 200) {
            const response = await request.json();
            const post = response.body.posts[0];

            if (post.owner_info) {
                post.canDelite = post.canEdit = false;
                if (post.author_link === userStore$1.user.user_link) {
                    post.canDelite = post.canEdit = true;
                } else if (post.owner_info.user_link === userStore$1.user.user_link) {
                    post.canDelite = true;
                }

                if (!post.owner_info.avatar_url) {
                    post.owner_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.owner_info.avatar_url = Ajax$1.imgUrlConvert(post.owner_info.avatar_url);
                }
            }

            if (post.community_info) {
                post.canDelite = post.canEdit = false;
                groupsStore$1.curGroup.management.forEach((user) => {
                    if (user.link === userStore$1.user.user_link) {
                        post.canDelite = post.canEdit = true;
                    }
                });

                if (!post.community_info.avatar_url) {
                    post.community_info.avatar_url = headerConst.avatarDefault;
                } else {
                    post.community_info.avatar_url = Ajax$1.imgUrlConvert(post.community_info.avatar_url);
                }
            }

            if (!post.comments) {
                post.comments_count = 0;
            }
            if (post.creation_date) {
                const date = new Date(post.creation_date);
                post.creation_date = (new Date(date)).toLocaleDateString('ru-RU', {dateStyle: 'long'});
            }
            post.avatar_url = userStore$1.user.avatar_url;

            if (post.attachments) {
                for (let i = 0; i < post.attachments.length; i++) {
                    const url = post.attachments[i];
                    let type = Router$1._getSearch(url).type;
                    if (type !== 'img') {
                        type = 'file';
                    }
                    post.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                    if (Router$1._getSearch(url).filename) {
                        post.attachments[i].filename = Router$1._getSearch(url).filename;
                    }
                }
            }
            if (Router$1.currentPage._jsId !== 'feed') {
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
        const request = await Ajax$1.deletePost(postId);

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
        console.log(this.deleteAttachments, this.addAttachments);
        const request = await Ajax$1.editPost(text, this.deleteAttachments, this.addAttachments, postId);

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
        const request = await Ajax$1.likePost(postId);

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
        const request = await Ajax$1.dislikePost(postId);

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

var postsStore$1 = new postsStore();

/**
 * класс, хранящий информацию о сообщениях
 */
class messagesStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        this.messages = [];
        this.chats = [];

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'getChats':
                await this._getChats(action.count, action.lastPostDate);
                break;
            case 'getChatsMsg':
                await this._getChatsMsg(action.chatId, action.count, action.lastPostDate);
                break;
            case 'chatCheck':
                await this._chatCheck(action.userLink, action.callback);
                break;
            case 'msgSend':
                await this._msgSend(action.chatId, action.text, action.attachments);
                break;
            case 'chatCreate':
                await this._chatCreate(action.userLinks, action.callback);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение чатов
     * @param {Number} count - количество получаемых чатов
     * @param {Date} lastPostDate - дата, после которой выбираются посты
     */
    async _getChats(count, lastPostDate) {
        const request = await Ajax$1.getChats(count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.chats = response.body.chats;

            this.chats.forEach((chat) => {
                if (chat.members.length === 1) {
                    if (!chat.members[0].avatar_url) {
                        chat.members[0].avatar_url = headerConst.avatarDefault;
                    } else {
                        chat.members[0].avatar_url = Ajax$1.imgUrlConvert(chat.members[0].avatar_url);
                    }
                    chat.avatar_url = chat.members[0].avatar_url;
                    chat.first_name = chat.members[0].first_name;
                    chat.last_name = chat.members[0].last_name;
                } else {
                    chat.members.forEach((member) => {
                        if (!member.avatar_url) {
                            member.avatar_url = headerConst.avatarDefault;
                        } else {
                            member.avatar_url = Ajax$1.imgUrlConvert(member.avatar_url);
                        }

                        if (member.user_link !== userStore$1.user.user_link) {
                            chat.avatar_url = member.avatar_url;
                            chat.first_name = member.first_name;
                            chat.last_name = member.last_name;
                        }
                    });
                }
            });
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getChats error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение сообщений конкретного чата
     * @param {Number} chatId - id чата
     * @param {Number} count - количество получаемых сообщений
     * @param {Date} lastPostDate - дата, после которой выбираются сообщения
     */
    async _getChatsMsg(chatId, count, lastPostDate) {
        const request = await Ajax$1.getChatsMsg(chatId, count, lastPostDate);

        if (request.status === 200) {
            const response = await request.json();
            this.messages = response.body.messages;
            this.messages.forEach((message) => {
                if (!message.sender_info.avatar_url) {
                    message.sender_info.avatar_url = headerConst.avatarDefault;
                } else {
                    message.sender_info.avatar_url = Ajax$1.imgUrlConvert(message.sender_info.avatar_url);
                }
                message.creation_date = new Date(message.creation_date).toLocaleDateString();
                if (message.attachments) {
                    for (let i = 0; i < message.attachments.length; i++) {
                        const url = message.attachments[i];
                        let type = Router$1._getSearch(url).type;
                        if (type !== 'img') {
                            type = 'file';
                        }
                        message.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                        if (Router$1._getSearch(url).filename) {
                            message.attachments[i].filename = Router$1._getSearch(url).filename;
                        }
                    }
                }
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('getChatsMsg error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на проверку чата пользователя
     * @param {String} userLink - сслыка на пользователя 
     */
    async _chatCheck(userLink, callback) {
        const request = await Ajax$1.chatCheck(userLink);

        if (request.status === 200) {
            const response = await request.json();
            if (response.body.has_dialog) {
                localStorage.setItem('chatFriendId', response.body.chat_id);
            } else {
                localStorage.removeItem('chatFriendId');
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCheck error');
        }

        if (callback) {
            callback();
        }
    }

    /**
     * Метод, реализующий реакцию на запрос об отправке сообщения
     * @param {Number} chatId - id чата
     * @param {String} text - текст сообщения
     */
    async _msgSend(chatId, text, attachments) {
        const request = await Ajax$1.msgSend(chatId, text, attachments);

        postsStore$1.attachments = [];

        if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status !== 200) {
            alert('msgSend error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на запрос о создании чата
     * @param {*} userLinks - id пользователей чата
     */
    async _chatCreate(userLinks, callback) {
        const request = await Ajax$1.chatCreate(userLinks);

        if (request.status === 200) {
            const response = await request.json();
            localStorage.setItem('chatId', response.body.chat.chat_id);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('chatCreate error');
        }

        if (callback) {
            callback();
        }
    }
}

var messagesStore$1 = new messagesStore();

/**
 * класс для работы с web сокетами
 */
class WebSock {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        if (Ajax$1.beckendStatus === 'local') {
            this._url = 'ws://' + Ajax$1.backendHostname + ':' + Ajax$1.backendPort + '/api/ws';
        } else {
            this._url = 'wss://' + Ajax$1.backendHostname + '/api/ws';
        }

        this._socket = null;
    }

    /**
     * метод, открывающий сокет и описывающий реакцию на сообщения
     */
    open() {
        if (!window['WebSocket']) {
            throw new Error('Ошибка: браузер не поддерживает WebSocket');
        }

        if (!this._socket && userStore$1.user.isAuth) {
            this._socket = new WebSocket(this._url);
        }

        this._socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            response.creation_date = new Date(response.creation_date).toLocaleDateString();
            if (!response.sender_info.avatar_url) {
                response.sender_info.avatar_url = headerConst.avatarDefault;
            }

            if (localStorage.getItem('chatId') === String(response.chat_id)) {
                if (response.attachments) {
                    for (let i = 0; i < response.attachments.length; i++) {
                        const url = response.attachments[i];
                        let type = Router$1._getSearch(url).type;
                        if (type !== 'img') {
                            type = 'file';
                        }
                        response.attachments[i] = {url: Ajax$1.imgUrlConvert(url), id: i + 1, type: type};
                        if (Router$1._getSearch(url).filename) {
                            response.attachments[i].filename = Router$1._getSearch(url).filename;
                        }
                    }
                }
                messagesStore$1.messages.push(response);
                localStorage.setItem('curMsg', document.getElementById('js-msg-input').value);
            }
            messagesStore$1._refreshStore();
        };
    }

    /**
     * метод, закрывающий сокет
     */
    close() {
        this._socket.close(1000, "ok");
    }
}

var WebSock$1 = new WebSock();

/**
 * класс, хранящий информацию о друзьях
 */
class userStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];
        this.user = {
            isAuth: false,
            errorAuth: '',
            errorReg: '',

            email: null,
            user_link: null,
            firstName: null,
            lastName: null,
            avatar_url: null,
            bio: null,
            birthday: null,
            status: null,
            lastActive: null,
        };

        this.userProfile = {
            isAuth: false,
            errorAuth: '',
            errorReg: '',

            email: null,
            user_link: null,
            firstName: null,
            lastName: null,
            avatar_url: null,
            bio: null,
            birthday: null,
            status: null,
            lastActive: null,
        };

        this.editMsg = '';
        this.editStatus = null;
        this.profile = null;

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'signIn':
                await this._signIn(action.data);
                break;
            case 'signUp':
                await this._signUp(action.data);
                break;
            case 'signOut':
                await this._signOut();
                break;
            case 'getProfile':
                await this._getProfile(action.callback, action.link);
                break;
            case 'checkAuth':
                await this._checkAuth(action.callback);
                break;
            case 'editProfile':
                await this._editProfile(action.data);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на вход
     * @param {Object} data - данные для входа
     */
    async _signIn(data) {
        const request = await Ajax$1.signIn(data.email, data.password);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            WebSock$1.open();
        } else {
            const response = await request.json();
            this.user.errorAuth = response.message;
            this.user.isAuth = false;
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на регистрацию
     * @param {Object} data - данные для входа
     */
    async _signUp(data) {
        const request = await Ajax$1.signUp(data.firstName, data.lastName, data.email, data.password);

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            WebSock$1.open();
        } else {
            const response = await request.json();
            this.user.errorReg = response.message;
            this.user.isAuth = false;
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на выход
     */
    async _signOut() {
        await Ajax$1.signOut();

        this.user.isAuth = false;
        this.editMsg = '';
        this.editStatus = null;
        groupsStore$1.editMsg = '';
        groupsStore$1.editStatus = null;

        if (localStorage.getItem('X-Csrf-Token')) {
            localStorage.removeItem('X-Csrf-Token');
        }
        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение информации о пользователе
     * @param {String} link - ссылка на пользователя
     */
    async _getProfile(callback, link) {
        const request = await Ajax$1.getProfile(link);
        const response = await request.json();

        if (request.status === 200) {
            let profile = {};

            profile.avatar_url = response.body.profile.avatar_url;
            profile.user_link = response.body.profile.user_link;
            profile.firstName = response.body.profile.first_name;
            profile.lastName = response.body.profile.last_name;
            profile.bio = response.body.profile.bio;
            profile.status = response.body.profile.status;
            profile.email = response.body.profile.email;

            if (response.body.profile.last_active) {
                const date = new Date(response.body.profile.last_active);
                profile.lastActive = (new Date(date)).toLocaleDateString('ru-RU', { dateStyle: 'long' });
            }

            if (response.body.profile.birthday) {
                profile.birthday = response.body.profile.birthday;
            }

            if (!profile.status) {
                profile.status = 'статус не задан';
            }

            if (!profile.avatar_url) {
                profile.avatar_url = headerConst.avatarDefault;
            } else {
                profile.avatar_url = Ajax$1.imgUrlConvert(profile.avatar_url);
            }

            if (!link || link === this.user.user_link) {
                profile.isAuth = true;
                this.user = profile;
            } else {
                this.userProfile = profile;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error getUserInfo');
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на проверку авторизации пользователя
     */
    async _checkAuth(callback) {
        const request = await Ajax$1.checkAuth();

        if (request.status === 200) {
            const csrfToken = request.headers.get('X-Csrf-Token');
            if (csrfToken) {
                localStorage.setItem('X-Csrf-Token', csrfToken);
            }

            this.user.isAuth = true;
            WebSock$1.open();
        } else {
            this.user.isAuth = false;
        }

        if (callback) {
            callback();
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на изменение информации о пользователе
     * @param {Object} data - данные пользователя
     */
    async _editProfile(data) {
        const request = await Ajax$1.editProfile(data.avatar_url, data.firstName, data.lastName, data.bio, data.birthday, data.status);
        if (request.status === 200) {
            if (data.avatar_url) {
                this.user.avatar_url = Ajax$1.imgUrlConvert(data.avatar_url);
            }

            this.user.firstName = data.firstName;
            this.user.lastName = data.lastName;
            this.user.bio = data.bio;
            this.user.birthday = data.birthday;
            this.user.status = data.status;

            this.editMsg = 'Данные профиля успешно обновлены';
            this.editStatus = true;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            this.editMsg = 'Ошибка сервера';
            this.editStatus = false;
        }

        this._refreshStore();
    }
}

var userStore$1 = new userStore();

const MAX_PASSWORD_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 30;
const MAX_STATUS_LENGTH = 30;
const MAX_BIO_LENGTH = 200;


/**
 * класс, реализующий валидацию форм
 */
class Validation {
	/**
     * @constructor
     * конструктор метода
     */
	constructor() {
		this.validateFunc = {
			password: this._validatePasswordAuth,
			email: this._validateEmail,
			firstName: this._validateName,
			lastName: this._validateSurname,
			secondPassword: this._validateTwoPasswords,
			userStatus: this._validateStatus,
			bio: this._validateBio,
			birthday: this._validateBirthday,
		};
	}

	/**
	 * метод для валидации
	 * @param {String} inputField - поле ввода 
	 * @param {String} errorField - поле ошибки
	 * @param {String} type - тип проверки
	 * @returns 
	 */
	validation(inputField, errorField, type, style) {
		const validationRes = this.validateFunc[type](inputField.value);

		if (validationRes.status === false) {
			errorField.textContent = validationRes.error;
			if (style === 'default') {
				inputField.classList.remove('input-block__field-correct');
				inputField.classList.add('input-block__field-incorrect');
			} else {
				inputField.classList.remove('input-block-settings__field-correct');
				inputField.classList.add('input-block-settings__field-incorrect');
			}
			return false;
		} else {
			errorField.textContent = '';
			if (style === 'default') {
				inputField.classList.add('input-block__field-correct');
				inputField.classList.remove('input-block__field-incorrect');
			} else {
				inputField.classList.add('input-block-settings__field-correct');
				inputField.classList.remove('input-block-settings__field-incorrect');
			}
			return true;
		}
	}

	/**
	 * метод для валидации повторного ппароля
	 * @param {String} inputPassword - поле ввода пароля
	 * @param {String} inputPasswordRepeat - поле ввода второго пароля
	 * @param {String} errorField - поле ошибки
	 * @param {String} type - тип проверки
	 * @returns 
	 */
	validationPassword(inputPassword, inputPasswordRepeat, errorField, style) {
		const validationRes = this._validateTwoPasswords(inputPassword.value, inputPasswordRepeat.value);

		if (validationRes.status === false) {
			errorField.textContent = validationRes.error;
			if (style === 'default') {
				inputPasswordRepeat.classList.remove('input-block__field-correct');
				inputPasswordRepeat.classList.add('input-block__field-incorrect');
			} else {
				inputPasswordRepeat.classList.remove('input-block-settings__field-correct');
				inputPasswordRepeat.classList.add('input-block-settings__field-incorrect');
			}
			return false;
		} else {
			errorField.textContent = '';
			if (style === 'default') {
				inputPasswordRepeat.classList.add('input-block__field-correct');
				inputPasswordRepeat.classList.remove('input-block__field-incorrect');
			} else {
				inputPasswordRepeat.classList.add('input-block-settings__field-correct');
				inputPasswordRepeat.classList.remove('input-block-settings__field-incorrect');
			}
			return true;
		}
	}

	/**
     * @private метод, валидирующий пароль при авторизации
     * @param {String} password пароль для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validatePasswordAuth(password) {
		if (password.length < 8) {
			return {
				status: false,
				error: `Пароль должен быть длиннее ${MIN_PASSWORD_LENGTH} символов`
			};
		}

		password.trim();

		for (const symbol of password) {
			if (symbol === ' ') {
				return {
					status: false,
					error: 'Пробелы в пароле недопустимы'
				};
			}
		}

		return {
			status: true,
		};
	}

	/**
     * @private метод, валидирующий пароль
     * @param {String} password пароль для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validatePassword(password) {
		if (!(password instanceof String) && typeof(password) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}


		if (password.length === 0) {
			return {
				status: false,
				error: 'Введите пароль'
			};
		}

		if (password.length < MIN_PASSWORD_LENGTH) {
			return {
				status: false,
				error: `Пароль должен быть длиннее ${MIN_PASSWORD_LENGTH} символов`
			};
		}

		if (password.length > MAX_PASSWORD_LENGTH) {
			return {
				status: false,
				error: `Пароль должен быть короче ${MAX_PASSWORD_LENGTH} символов`
			};
		}

		let hasUpperCaseChars = false;
		let hasDigits = false;
		for (const char of password) {

			if (char.match(/[a-zA-Z]/i) != null) {
				// проверка на врехний регистр
				if (char === char.toUpperCase()) {
					hasUpperCaseChars = true;
				}
			}

			// проверка на цифру
			if (char.match(/^[0-9]+$/) != null) {
				hasDigits = true;
			}

			if (char === ' ') {
				return {
					status: false,
					error: 'Пробелы в пароле не допускаются'
				};
			}

		}

		if (!hasDigits) {
			return {
				status: false,
				error: 'Пароль должен содержать хотя бы одну цифру'
			};
		}

		if (!hasUpperCaseChars) {
			return {
				status: false,
				error: 'Пароль должен содержать хотя бы одну заглавную букву'
			};
		}

		return {
			status: true,
		};
	}

	/**
     * @private метод, валидирующий почту
     * @param {String} email email для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateEmail(email) {
		if (email.length === 0) {
			return {
				status: false,
				error: 'Введите электронную почту'
			};
		}

		if (!(email instanceof String) && typeof(email) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		const match = email.match(/@/);

		if (match == null) {
			return {
				status: false,
				error: 'Некорректный адрес электронной почты'
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий имя
     * @param {String} name имя для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateName(name) {
		if (!(name instanceof String) && typeof(name) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (name.length === 0) {
			return {
				status: false,
				error: 'Введите имя'
			};
		}

		if (name.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: `Имя должно быть короче ${MAX_NAME_LENGTH} символов`
			};
		}

		for (const char of name) {
			if (char.match(/[a-zA-Zа-яА-ЯЁё]/i) == null) {
				return {
					status: false,
					error: 'Имя должно содержать буквенные символы'
				};
			}
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий фамилию
     * @param {String} surname имя для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateSurname(surname) {
		if (!(surname instanceof String) && typeof(surname) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (surname.length === 0) {
			return {
				status: false,
				error: 'Введите фамилию'
			};
		}

		if (surname.length > MAX_NAME_LENGTH) {
			return {
				status: false,
				error: `Фамилия должна быть короче ${MAX_NAME_LENGTH} символов`
			};
		}

		for (const char of surname) {
			if (char.match(/[a-zA-Zа-яА-Я]/i) == null) {
				return {
					status: false,
					error: 'Фамилия должна содержать буквенные символы'
				};
			}
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий статус
     * @param {String} userStatus статус для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateStatus(userStatus) {
		if (!(userStatus instanceof String) && typeof(userStatus) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (userStatus.length === 0) {
			return {
				status: false,
				error: 'Введите статус'
			};
		}

		if (userStatus.length > MAX_STATUS_LENGTH) {
			return {
				status: false,
				error: `Статус должен быть короче ${MAX_STATUS_LENGTH} символов`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий био
     * @param {String} bio био для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateBio(bio) {
		if (!(bio instanceof String) && typeof(bio) != 'string') {
			return {
				status: false,
				error: 'Недопустимый формат данных'
			};
		}

		if (bio.length > MAX_BIO_LENGTH) {
			return {
				status: false,
				error: `Информация должна быть короче ${MAX_BIO_LENGTH} символов`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, валидирующий день рождения
     * @param {String} birthday день рождения для валидации
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateBirthday(birthday) {
		if (birthday > maxBirthday) {
			return {
				status: false,
				error: `Год рождения не должен превышать ${maxBirthday.slice(0, 4)}`
			};
		}

		return {
			status: true,
		}
	}

	/**
     * @private метод, сравнивающий два пароля
     * @param {String} password1 первый пароль
	 * @param {String} password2 второй пароль
	 * @return {Boolean} статус
     * @return {String | null} сообщение об ошибке
     */
	_validateTwoPasswords(password1, password2) {
		if (password2.length === 0) {
			return {
				status: false,
				error: 'Введите пароль'
			};
		}

		if (password1 !== password2) {
			return {
				status: false,
				error: 'Пароли не совпадают'
			};
		}

		return {
			status: true,
		}
	}
}

var Validation$1 = new Validation();

class SignInView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-in';
        this.curPage = false;

        this._validateEmail = false;
        this._validatePassword = false;

        userStore$1.registerCallback(this.updatePage.bind(this));
    }

    _addHandlebarsPartial() {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath);
        Handlebars.registerPartial('signInPath', Handlebars.templates.signInPath);
        Handlebars.registerPartial('button', Handlebars.templates.button);
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
    }

    _addPagesElements() {
        this._emailField = document.getElementById('js-email-input');
        this._emailErrorField = document.getElementById('js-email-error');
        this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
        this._authBtn = document.getElementById('js-sign-in-btn');
        this._newBtn = document.getElementById('js-create-account-btn');
    }

    _addPagesListener() {
        this._authBtn.addEventListener('click', () => {
            if (this._validatePassword && this._validateEmail) {
                actionUser.signIn({email: this._emailField.value, password: this._passwordField.value});
            } else {
                userStore$1.user.errorAuth = 'Заполните корректно все поля';
                this._render();
            }
        });

        this._newBtn.addEventListener('click', () => {
            Router$1.go('/signUp', false);
        });

        this._emailField.addEventListener('change', () => {
            this._validateEmail = Validation$1.validation(this._emailField, this._emailErrorField, 'email', 'default');
        });
        this._passwordField.addEventListener('change', () => {
            this._validatePassword = Validation$1.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
        });
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
        userStore$1.user.errorAuth = '';
    }

    showPage() {
        actionUser.checkAuth();
    }

    updatePage() {
        if (this.curPage) {
            if (userStore$1.user.isAuth) {
                Router$1.go('/feed');
                return;
            }
            this._render();
        }
    }

    _preRender() {
        this._template = Handlebars.templates.signIn;

        if (userStore$1.user.errorAuth) {
            signInData.errorInfo['errorText'] = userStore$1.user.errorAuth;
            signInData.errorInfo['errorClass'] = 'display-inline-grid';
        } else {
            signInData.errorInfo['errorText'] = '';
            signInData.errorInfo['errorClass'] = 'display-none';
        }

        this._context = {
            logoData: logoDataSignIn,
            signInData: signInData,
        };
    }

    _render() {
        this._preRender();
        Router$1.rootElement.innerHTML = this._template(this._context);
        this._addPagesElements();
        this._addPagesListener();
    }
}

class SignUpView {
    constructor() {
        this._addHandlebarsPartial();

        this._jsId = 'sign-up';
        this.curPage = false;

        this._validateFirstName = false;
        this._validateLastName = false;
        this._validateEmail = false;
        this._validatePassword = false;
        this._validatePasswordRepeat = false;

        userStore$1.registerCallback(this.updatePage.bind(this));
    }

    _addHandlebarsPartial() {
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath);
        Handlebars.registerPartial('signUpPath', Handlebars.templates.signUpPath);
        Handlebars.registerPartial('button', Handlebars.templates.button);
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
    }

    _addPagesElements() {
        this._firstNameField = document.getElementById('js-first-name-input');
        this._firstNameErrorField = document.getElementById('js-first-name-error');
        this._lastNameField = document.getElementById('js-last-name-input');
        this._lastNameErrorField = document.getElementById('js-last-name-error');
        this._emailField = document.getElementById('js-email-input');
        this._emailErrorField = document.getElementById('js-email-error');
        this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
        this._passwordRepeatField = document.getElementById('js-repeat-password-input');
        this._passwordRepeatErrorField = document.getElementById('js-repeat-password-error');

        this._regBtn = document.getElementById('js-sign-up-btn');
        this._logBtn = document.getElementById('js-have-account-btn');
    }

    _addPagesListener() {
        this._regBtn.addEventListener('click', () => {
            if (this._validateFirstName && this._validateLastName && this._validateEmail && this._validatePassword && this._validatePasswordRepeat) {
                actionUser.signUp({firstName: this._firstNameField.value, lastName: this._lastNameField.value, email: this._emailField.value, password: this._passwordField.value});
            } else {
                userStore$1.user.errorReg = 'Заполните корректно все поля';
                this._render();
            }
        });

        this._logBtn.addEventListener('click', () => {
            Router$1.go('/signIn', false);
        });


        this._firstNameField.addEventListener('change', () => {
            this._validateFirstName = Validation$1.validation(this._firstNameField, this._firstNameErrorField, 'firstName', 'default');
        });
        this._lastNameField.addEventListener('change', () => {
            this._validateLastName = Validation$1.validation(this._lastNameField, this._lastNameErrorField, 'lastName', 'default');
        });
        this._emailField.addEventListener('change', () => {
            this._validateEmail = Validation$1.validation(this._emailField, this._emailErrorField, 'email', 'default');
        });
        this._passwordField.addEventListener('change', () => {
            this._validatePassword = Validation$1.validation(this._passwordField, this._passwordErrorField, 'password', 'default');
        });
        this._passwordRepeatField.addEventListener('change', () => {
            this._validatePasswordRepeat = Validation$1.validationPassword(this._passwordField, this._passwordRepeatField, this._passwordRepeatErrorField, 'default');
        });
    }

    remove() {
        document.getElementById(this._jsId)?.remove();
        userStore$1.user.errorReg = '';
    }

    showPage() {
        actionUser.checkAuth();
    }

    updatePage() {
        if (this.curPage) {
            if (userStore$1.user.isAuth) {
                actionUser.getProfile();
                Router$1.go('/feed');
            } else {
                this._render();
            }
        }
    }

    _preRender() {
        this._template = Handlebars.templates.signUp;

        if (userStore$1.user.errorReg) {
            signUpData.errorInfo['errorText'] = userStore$1.user.errorReg;
            signUpData.errorInfo['errorClass'] = 'display-inline-grid';
        } else {
            signUpData.errorInfo['errorText'] = '';
            signUpData.errorInfo['errorClass'] = 'display-none';
        }

        this._context = {
            logoData: logoDataSignUp,
            signUpData: signUpData,
        };
    }

    _render() {
        this._preRender();
        Router$1.rootElement.innerHTML = this._template(this._context);
        this._addPagesElements();
        this._addPagesListener();
    }
}

/**
 * action-ы для работы с постами 
 */
const actionPost = {
    /**
     * action для получения списка постов пользователя
     * @param {*} userLink - ссылка пользователя
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsByUser(userLink, count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getPosts',
            userLink,
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения списка постов друзей пользователя
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getFriendsPosts(count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getFriendsPosts',
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения постов по id 
     * @param {*} id - id постов
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsById(id, count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getPostById',
            id,
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения списка постов сообщества
     * @param {*} community_link - ссылка на сообщество
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsByCommunity(community_link, count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getPostsByCommunity',
            community_link,
            count,
            lastPostDate,
        });
    },
    /**
     * action для удаления поста
     * @param {*} postId - id поста
     */
    deletePost(postId) {
        Dispatcher$1.dispatch({
            actionName: 'deletePost',
            postId,
        });
    },
    /**
     * action для создания поста на странице пользователя
     * @param {*} author_link - ссылка на автора поста
     * @param {*} owner_link - ссылка на страницу пользователя, у которого на странице будет пост
     * @param {*} show_author - показывать ли автора поста
     * @param {*} text - текст поста
     */
    createPostUser(author_link, owner_link, show_author, text) {
        Dispatcher$1.dispatch({
            actionName: 'createPost',
            data: {
                author_link,
                owner_link,
                show_author,
                text,
            },
        });
    },
    /**
     * action для создания поста на странице сообщества
     * @param {*} author_link - ссылка на автора поста
     * @param {*} community_link - ссылка на сообщество, где будет пост
     * @param {*} show_author - показывать ли автора поста
     * @param {*} text - текст поста
     */
    createPostCommunity(author_link, community_link, show_author, text) {
        Dispatcher$1.dispatch({
            actionName: 'createPost',
            data: {
                author_link,
                community_link,
                show_author,
                text
            },
        });
    },
    /**
     * action для изменения поста
     * @param {*} text - текст поста
     * @param {*} postId - id поста
     */
    editPost(text, postId) {
        Dispatcher$1.dispatch({
            actionName: 'editPost',
            text,
            postId,
        });
    },
    /**
     * action для лайка поста
     * @param {*} postId - id поста
     */
    likePost(postId) {
        Dispatcher$1.dispatch({
            actionName: 'likePost',
            postId,
        });
    },
    /**
     * action для дизлайка поста
     * @param {*} postId - id поста
     */
    dislikePost(postId) {
        Dispatcher$1.dispatch({
            actionName: 'dislikePost',
            postId,
        });
    },

    getComments(postID, count, lastCommentDate) {
        Dispatcher$1.dispatch({
            actionName: 'getComments',
            postID,
            count,
            lastCommentDate
        });
    },

    getComment(id) {
        Dispatcher$1.dispatch({
            actionName: 'getComment',
            id,
        });
    },

    createComment(postID, text, replyTo) {
        Dispatcher$1.dispatch({
            actionName: 'createComment',
            postID,
            text,
            replyTo
        });
    },

    deleteComment(id) {
        Dispatcher$1.dispatch({
            actionName: 'deleteComment',
            id
        });
    },

    editComment(id, text) {
        Dispatcher$1.dispatch({
            actionName: 'editComment',
            id,
            text
        });
    }
};

/**
 * action-ы для работы с пользователем
 */
const actionSearch = {
    search(text) {
        Dispatcher$1.dispatch({
            actionName: 'userSearch',
            searchText: text,
            count: 10,
            offset: 0,
        });
    },

    searchForDropdown(text) {
        Dispatcher$1.dispatch({
            actionName: 'userSearch',
            searchText: text,
            count: 3,
            offset: 0,
        });
    },

    friendSearchForDropdown(link) {
        Dispatcher$1.dispatch({
            actionName: 'friendsSearch',
            link: link,
            count: 3,
            offset: 0
        });
    }
};

/**
 * класс, хранящий информацию о результатах поиска
 */
class DropdownSearchStore {
    /**
     * @constructor
     * конструктор класса
     */
    constructor() {
        this._callbacks = [];

        this.userSearchItems = [];
        this.communitySearchItems = [];

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'userSearch':
                await this._getGlobalSearchResult(action.searchText, action.count, action.offset);
                break;
            default:
                return;
        }
    }

    async _getGlobalSearchResult(searchText, count, offset) {
        const request = await Ajax$1.getGlobalSearchResult(searchText, count, offset);

        if (request.status === 200) {
            const response = await request.json();

            if (response.body.users != null) {
                this.userSearchItems = response.body.users;
            } else {
                this.userSearchItems = [];
            }

            if (response.body.communitites != null) {
                this.communitySearchItems = response.body.communitites;
            } else {
                this.communitySearchItems = [];
            }
            this.userSearchItems.forEach((user) => {
                if (!user.avatar_url) {
                    user.avatar_url = headerConst.avatarDefault;
                } else {
                    user.avatar_url = Ajax$1.imgUrlConvert(user.avatar_url);
                }
                if (!user.isFriend && !user.isSubscriber && !user.isSubscribed) {
                    user.isUser = true;
                }
            });

            this.communitySearchItems.forEach((community) => {
                if (!community.avatar_url) {
                    community.avatar_url = headerConst.avatarDefault;
                } else {
                    community.avatar_url = Ajax$1.imgUrlConvert(community.avatar_url);
                }

                community.isCommunity = true;
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else if (request.status === 400) {
            this.userSearchItems = [];
            this.communitySearchItems = [];
        } else {
            alert('search error');
        }

        this._refreshStore();
    }

}

var searchStore = new DropdownSearchStore();

/**
 * класс, хранящий информацию о результатах поиска
 */
class DropdownFriendsSearchStore {
    /**
     * @constructor
     * конструктор класса
     */
    constructor() {
        this._callbacks = [];

        this.friends = [];

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'friendsSearch':
                await this._getFriends(action.link, action.count, action.offset);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка друзей
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getFriends(link, count, offset) {
        const request = await Ajax$1.getFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.friends.forEach((friend) => {
                friend.isFriend = true;
                if (!friend.avatar_url) {
                    friend.avatar_url = headerConst.avatarDefault;
                } else {
                    friend.avatar_url = Ajax$1.imgUrlConvert(friend.avatar_url);
                }
                if (!friend.city) {
                    friend.city = 'город не указан';
                }
            });

            this.friends = response.body.friends;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

var dropdownFriendsSearchStore = new DropdownFriendsSearchStore();

/**
 * action-ы для работы с сообщениями 
 */
const actionMessage = {
    /**
     * action для получения списка чата пользователей
     * @param {*} count - количестко возвращаемых чатов
     * @param {*} lastPostDate - дата, после которой получаются чаты
     */
    getChats(count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getChats',
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения сообщений конкретного чата
     * @param {*} chatId - id чата
     * @param {*} count - количество возвращаемых сообщений
     * @param {*} lastPostDate - дата, после которой получаются сообщения
     */
    getChatsMsg(chatId, count, lastPostDate) {
        Dispatcher$1.dispatch({
            actionName: 'getChatsMsg',
            chatId,
            count,
            lastPostDate,
        });
    },
    /**
     * action для проверки наличия чата с конктретным пользователем
     * @param {*} userLink - ссылка на пользователя, с которым проверяем наличие чата
     */
    chatCheck(userLink, callback) {
        Dispatcher$1.dispatch({
            actionName: 'chatCheck',
            userLink,
            callback,
        });
    },
    /**
     * action для отправки сообщения в чат
     * @param {*} chatId - id чата
     * @param {*} text - текст отправляемого сообщения
     */
    msgSend(chatId, text, attachments = null) {
        Dispatcher$1.dispatch({
            actionName: 'msgSend',
            chatId,
            text,
            attachments,
        });
    },
    /**
     * action для создания нового чата
     * @param {*} userLinks - ссылки на поьзователей-участников чата
     */
    chatCreate(userLinks, callback) {
        Dispatcher$1.dispatch({
            actionName: 'chatCreate',
            userLinks,
            callback,
        });
    },
};

/**
 * action-ы для работы с группами
 */
const actionGroups = {
    /**
     * action для получения списка групп по ссылке пользователя
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getGroups(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getGroups',
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, созданных пользователем
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getmanageGroups(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getManageGroups',
            count,
            offset,
        });
    },
    /**
     * action для получения списка групп, на которые не подписан пользователь
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getNotGroups(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getNotGroups',
            count,
            offset,
        });
    },
    /**
     * action для получения списка популярных групп
     * @param {*} count - количество возвращаемых групп
     * @param {*} offset - смещение
     */
    getPopularGroups(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getPopularGroups',
            count,
            offset,
        });
    },
    /**
     * action, который используется, чтобы подписаться на группу
     * @param {*} link - ссылка на группу
     */
    groupSub(link) {
        Dispatcher$1.dispatch({
            actionName: 'groupSub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отписаться от группы
     * @param {*} link - ссылка на группу
     */
    groupUnsub(link) {
        Dispatcher$1.dispatch({
            actionName: 'groupUnsub',
            link,
        });
    },
    getGroupInfo(callback, link) {
        Dispatcher$1.dispatch({
            actionName: 'getGroupInfo',
            callback,
            link,
        });
    },
    /**
     * action, который используется, чтобы создать группу
     * @param {*} data - данные группы
     */
    createGroup(data) {
        Dispatcher$1.dispatch({
            actionName: 'createGroup',
            data,
        });
    },
    /**
     * action для редактирования группы в системе
     * @param {*} data - данные группы
     */
    editGroup(data) {
        Dispatcher$1.dispatch({
            actionName: 'editGroup',
            data,
        });
    },
    /**
     * action для удвления группы
     * @param {*} link - данные группы
     */
    deleteGroup(link) {
        Dispatcher$1.dispatch({
            actionName: 'deleteGroup',
            link,
        });
    },
    /**
     * action для получения подписчиков группы
     * @param {*} link - данные группы
     * @param {*} count - данные группы
     * @param {*} offset - данные группы
     */
    getGroupsSub(link, count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getGroupsSub',
            link,
            count,
            offset,
        });
    },
};

/**
 * Базовый класс View
 */
class BaseView {
    /**
     * Конструктор базового класса view. Содержит подключение компонентов Handlebars,
     * и информацию о странице отрисовки.
     */
    constructor() {
        this.addHandlebarsPartial();
        this.addStore();

        this.curPage = false;
        this.timerId = null;
    }

    /**
     * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addStore() {
        searchStore.registerCallback(this._updateDropdownSearchList.bind(this));
        dropdownFriendsSearchStore.registerCallback(this._initDropdownSearchList.bind(this));
    }

    /**
     * @private метод, подключающий необходимые компоненты к классу.
     */
    addHandlebarsPartial() {
        Handlebars.registerPartial('button', Handlebars.templates.button);
        Handlebars.registerPartial('buttonDefault', Handlebars.templates.buttonDefault);
        Handlebars.registerPartial('chat', Handlebars.templates.chat);
        Handlebars.registerPartial('chatItem', Handlebars.templates.chatItem);
        Handlebars.registerPartial('chatPage', Handlebars.templates.chatPage);
        Handlebars.registerPartial('comment', Handlebars.templates.comment);
        Handlebars.registerPartial('commentArea', Handlebars.templates.commentArea);
        Handlebars.registerPartial('createPost', Handlebars.templates.createPost);
        Handlebars.registerPartial('editPost', Handlebars.templates.editPost);
        Handlebars.registerPartial('editPostPage', Handlebars.templates.editPostPage);
        Handlebars.registerPartial('feed', Handlebars.templates.feed);
        Handlebars.registerPartial('friend', Handlebars.templates.friend);
        Handlebars.registerPartial('friendNotFound', Handlebars.templates.friendNotFound);
        Handlebars.registerPartial('friends', Handlebars.templates.friends);
        Handlebars.registerPartial('groupItem', Handlebars.templates.groupItem);
        Handlebars.registerPartial('subscriber', Handlebars.templates.subscriber);
        Handlebars.registerPartial('newGroup', Handlebars.templates.newGroup);
        Handlebars.registerPartial('deleteGroup', Handlebars.templates.deleteGroup);
        Handlebars.registerPartial('groups', Handlebars.templates.groups);
        Handlebars.registerPartial('group', Handlebars.templates.group);
        Handlebars.registerPartial('groupCard', Handlebars.templates.groupCard);
        Handlebars.registerPartial('header', Handlebars.templates.header);
        Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
        Handlebars.registerPartial('inputSettings', Handlebars.templates.inputSettings);
        Handlebars.registerPartial('logoPath', Handlebars.templates.logoPath);
        Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
        Handlebars.registerPartial('message', Handlebars.templates.message);
        Handlebars.registerPartial('messages', Handlebars.templates.messages);
        Handlebars.registerPartial('post', Handlebars.templates.post);
        Handlebars.registerPartial('postArea', Handlebars.templates.postArea);
        Handlebars.registerPartial('profile', Handlebars.templates.profile);
        Handlebars.registerPartial('profileCard', Handlebars.templates.profileCard);
        Handlebars.registerPartial('search', Handlebars.templates.search);
        Handlebars.registerPartial('settings', Handlebars.templates.settings);
        Handlebars.registerPartial('settingsPath', Handlebars.templates.settingsPath);
        Handlebars.registerPartial('settingsPathGroup', Handlebars.templates.settingsPathGroup);
        Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
        Handlebars.registerPartial('signIn', Handlebars.templates.signIn);
        Handlebars.registerPartial('signUp', Handlebars.templates.signUp);
        Handlebars.registerPartial('signInPath', Handlebars.templates.signInPath);
        Handlebars.registerPartial('signUpPath', Handlebars.templates.signUpPath);
        Handlebars.registerPartial('searchDropdown', Handlebars.templates.searchDropdown);
        Handlebars.registerPartial('searchItem', Handlebars.templates.searchItem);
        Handlebars.registerPartial('subscriber', Handlebars.templates.subscriber);

        Handlebars.registerHelper('combine', function(object1, object2) {
            return Object.assign({}, object1, object2);
        });

        Handlebars.registerHelper('eq', function(value1, value2) {
            return value1 === value2.toString();
        });


    }

    /**
     * метод, добавляющий на страницу базовые элементы.
     */
    addPagesElements() {
        this._exitBtn = document.getElementById('js-exit-btn');
        this._settingsBtn = document.getElementById('js-settings-btn');

        this._feedBtn = document.getElementById('js-logo-go-feed');
        this._myPageItem = document.getElementById('js-side-bar-my-page');
        this._newsItem = document.getElementById('js-side-bar-news');
        this._msgItem = document.getElementById('js-side-bar-msg');
        this._photoItem = document.getElementById('js-side-bar-photo');
        this._friendsItem = document.getElementById('js-side-bar-friends');
        this._groupsItem = document.getElementById('js-side-bar-groups');
        this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

        this._searchAreaInput = document.getElementById('js-search-area-input');
        this._searchArea = document.getElementById('js-search-area');
        this._searchDropdown = document.getElementById('js-search-dropdown');
        this._showMorePeopleButton = document.getElementById('js-show-more-people');
        this._showMoreCommunititesButton = document.getElementById('js-show-more-communities');
        this._sendMessageButtons = document.getElementsByClassName('search-item__send-message-icon-container');
        this._subscribeButtons = document.getElementsByClassName('search-item__subscription-icon-container');

        this._goToProfile = document.getElementsByClassName('js-go-to-profile');
        this._goToGroup = document.getElementsByClassName('js-go-to-group');

        this._userSearchItems = document.getElementsByClassName("user-search-item");
        this._group_search_items = document.getElementsByClassName("group-search-item");
    }

    /**
     * метод, добавляющий на страницу события базовых элементов.
     */
    addPagesListener() {
        this._exitBtn.addEventListener('click', () => {
            actionUser.signOut();
        });

        this._settingsBtn.addEventListener('click', () => {
            Router$1.go('/settings', false);
        });

        this._groupsItem.addEventListener('click', () => {
            Router$1.go('/groups', false);
        });
 
        this._feedBtn.addEventListener('click', () => {
            Router$1.go('/feed', false);
        });

        this._myPageItem.addEventListener('click', () => {
            Router$1.go('/user', false);
        });

        this._msgItem.addEventListener('click', () => {
            Router$1.go('/message', false);
        });

        this._newsItem.addEventListener('click', () => {
            Router$1.go('/feed', false);
        });

        this._friendsItem.addEventListener('click', () => {
            Router$1.go('/friends', false);
        });

        this._searchArea.addEventListener('blur', (event) => {
            this._searchDropdown.style.display = 'none';
        }, true);

        this._searchAreaInput.addEventListener('keyup', (event) => {
            this.interruptTimer();

            this.startTimer(250, () => {
                if (this._searchAreaInput.value.trim() === "") {
                    this._initDropdownSearchList();
                }

                if (this._searchAreaInput.value.trim() !== "") {
                    actionSearch.searchForDropdown(this._searchAreaInput.value);
                }
            });
        });

        this._searchAreaInput.addEventListener('click', () => {
            this._searchDropdown.style.display = 'grid';
            // почему-то летит 6 запросов по одному кликую........
            if (this._searchAreaInput.value.trim() === "") {
                if (userStore$1.user.user_link === null) {
                    actionUser.getProfile(() => {
                        actionSearch.friendSearchForDropdown(userStore$1.user.user_link, 3, 0);
                    });
                } else {
                    actionSearch.friendSearchForDropdown(userStore$1.user.user_link, 3, 0);
                }
            } else {
                actionSearch.searchForDropdown(this._searchAreaInput.value);
            }
        });

        for (let i = 0; i < this._goToProfile.length; i++) {
            this._goToProfile[i].addEventListener('click', () => {
                const userId = this._goToProfile[i].getAttribute("data-id");
                Router$1.go('/user?link=' + userId, false);
            });
        }

        for (let i = 0; i < this._goToGroup.length; i++) {
            this._goToGroup[i].addEventListener('click', () => {
                const groupId = this._goToGroup[i].getAttribute("data-id");
                Router$1.go('/group?link=' + groupId, false);
            });
        }
    }

    _addDropdownEventListeners() {
        for (let i = 0; i < this._sendMessageButtons.length; ++i) {
            this._sendMessageButtons[i].addEventListener('mousedown', () => {
                let userLink = this._userSearchItems[i].getAttribute('data-user-link');
                this.startMessaging(userLink);
            });
        }

        for (let i = 0; i < this._subscribeButtons.length; ++i) {
            this._subscribeButtons[i].addEventListener('mousedown', (event) => {
                let groupLink = this._group_search_items[i].getAttribute('data-group-link');
                this.subscribe(groupLink);
                this._subscribeButtons[i].hidden = true;
                event.stopImmediatePropagation();
            });
        }

        if (this._showMorePeopleButton !== null) {
            this._showMorePeopleButton.addEventListener('mousedown', () => {
                localStorage.setItem("searchQuery", this._searchAreaInput.value);
                Router$1.go('/findFriends');
            });
        }

        if (this._showMoreCommunititesButton !== null) {
            this._showMoreCommunititesButton.addEventListener('mousedown', () => {
                localStorage.setItem("searchQuery", this._searchAreaInput.value);
                Router$1.go('/findGroups');
            });
        }

        for (let i = 0; i < this._group_search_items.length; i++) {
            this._group_search_items[i].addEventListener('mousedown', () => {
                const groupLink = this._group_search_items[i].getAttribute("data-group-link");
                Router$1.go('/group?link=' + groupLink);
            });
        }

        for (let i = 0; i < this._userSearchItems.length; i++) {
            this._userSearchItems[i].addEventListener('mousedown', () => {
                const userLink = this._userSearchItems[i].getAttribute("data-user-link");
                Router$1.go('/user?link=' + userLink);
            });
        }

    }

    _updateDropdownSearchList() {
        this.addPagesElements();
        this._template = Handlebars.templates.searchDropdown;
        let isEmpty = searchStore.userSearchItems.length === 0 && searchStore.communitySearchItems.length === 0;
        this._context = {
            userSearchItems: searchStore.userSearchItems,
            communitySearchItems: searchStore.communitySearchItems,
            isEmpty: isEmpty,
            searchDropdownConst: searchDropdownConst
        };

        this._searchDropdown.innerHTML = this._template(this._context);
        this.addPagesElements();
        this._addDropdownEventListeners();
    }

    _initDropdownSearchList() {
        this.addPagesElements();
        this._template = Handlebars.templates.searchDropdown;
        let isEmpty = dropdownFriendsSearchStore.friends.length === 0;
        this._context = {
            userSearchItems: dropdownFriendsSearchStore.friends,
            communitySearchItems: [],
            isEmpty: isEmpty,
            searchDropdownConst: searchDropdownConst,
        };

        this._searchDropdown.innerHTML = this._template(this._context);
        this.addPagesElements();

        this._addDropdownEventListeners();
    }

    /**
     * Метод, удаляющий текущую страницу.
     */
    remove() {
        document.getElementById(this._jsId)?.remove();
        //ToDo: снимать лисенеры
    }

    /**
     * Метод, вызываемый callback при изменении store, от которых он зависит.
     */
    updatePage() {
        if (this.curPage) {
            if (!userStore$1.user.isAuth) {
                Router$1.go('/signIn');
            } else {
                this.render();
            }
        }
    }

    subscribe(groupLink) {
        actionGroups.groupSub(groupLink);
    }

    startMessaging(userId) {
        actionMessage.chatCheck(userId, () => {
            if (localStorage.getItem('chatFriendId')) {
                localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
                Router$1.go('/chat', false);
                actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
            } else {
                actionMessage.chatCreate(userId, () => {
                    if (localStorage.getItem('chatId')) {
                        Router$1.go('/chat', false);
                        actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
                    }
                });
            }
        });
    }

    startTimer(time, callback) {
        this.timerId = window.setTimeout(callback, time);
    }

    interruptTimer() {
        window.clearTimeout(this.timerId);
    }

    /**
     * @private метод, задающий контекст отрисовки конкретной вьюхи.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    _preRender() {
    }

    /**
     * @private метод отрисовки страницы.
     */
    render() {
        this._preRender();
        Router$1.rootElement.innerHTML = this._template(this._context);
        this.addPagesElements();
        this.addPagesListener();
    }
}

const actionImg = {
    uploadImg(data, callback, filename = null) {
        Dispatcher$1.dispatch({
            actionName: 'uploadImg',
            data,
            callback,
            filename,
        });
    },
    deleteImg() {
        Dispatcher$1.dispatch({
            actionName: 'deleteImg',
        });
    },
};

class FeedView extends BaseView {
	constructor() {
		super();

		this._jsId = 'feed';
		this.curPage = false;

		this._commentBatchToLoad = 5;

		this.isCreate = false;
		this.isEdit = false;
	}

	addStore() {
		postsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._newsItem.style.color = activeColor;

		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

    	this._createPosts = document.getElementById('js-create-post');
		this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');
		this._commentsButtons = document.getElementsByClassName("post-buttons-comment");
		this._commentsAreas = document.getElementsByClassName("comments-area");
		this._sendCommentButtons = document.getElementsByClassName('create-comment__send-icon');
		this._commentInput = document.getElementsByClassName('depeche-multiline-input');

		this._commentDeleteButton = document.getElementsByClassName("comment-operations__delete");

		this._commentEditButton = document.getElementsByClassName("comment-operations__update");
		this._commentEditSaveButton = document.getElementsByClassName("submit-comment-edit-button");
		this._commentEditCancelButton = document.getElementsByClassName("cancel-comment-edit-button");
		this._commentEditInput = document.getElementsByClassName("comment-edit-input");

		this._showMoreCommentsButton = document.getElementsByClassName("show-more-block");

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');

		this._addPhotoToPostPic = document.getElementById('js-add-photo-to-post-pic');
		this._addPhotoToPost = document.getElementById('js-add-photo-to-post');
		this._removeImg = document.getElementsByClassName('close-button');
	}

	addPagesListener() {
		super.addPagesListener();

		this._text = document.getElementById('js-edit-post-textarea');
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		if (this._text) {
			this._text.focus();

			this._editBtn = document.getElementById('js-edit-post-btn');
			let textarea = document.getElementsByTagName('textarea');

			textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
			textarea[0].addEventListener("input", OnInput, false);
		}

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		for (let i = 0; i < this._likePosts.length; i++) {
				this._likePosts[i].addEventListener('click', () => {
						const postId = this._likePosts[i].getAttribute("data-id");
						actionPost.likePost(Number(postId));
				});
		}

		for (let i = 0; i < this._dislikePosts.length; i++) {
			this._dislikePosts[i].addEventListener('click', () => {
					const postId = this._dislikePosts[i].getAttribute("data-id");
					actionPost.dislikePost(Number(postId));
			});
		}

		for (let i = 0; i < this._commentsButtons.length; i++) {
			this._commentsButtons[i].addEventListener('click', () => {
				if (postsStore$1.comments.get(postsStore$1.posts[i].id) === undefined || postsStore$1.comments.get(postsStore$1.posts[i].id).length === 0) {
					actionPost.getComments(postsStore$1.posts[i].id, this._commentBatchToLoad);
				} else {
					postsStore$1.comments.delete(postsStore$1.posts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");

					this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
					postsStore$1.haveCommentsContinuation.delete(postsStore$1.posts[i].id);
				}
			});
		}

		for (let i = 0; i < this._sendCommentButtons.length; ++i) {
			this._sendCommentButtons[i].addEventListener('click', () => {
				if (this._commentInput[i].value.trim() !== '') {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});

		}

		for (let i = 0; i < this._commentInput.length; ++i) {
			this._commentInput[i].addEventListener('keyup', (event) => {
				if (this._commentInput[i].value.trim() !== '' && event.code === 'Enter' && document.activeElement === this._commentInput[i]) {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});
		}

		for (let i = 0; i < this._commentDeleteButton.length; ++i) {
			this._commentDeleteButton[i].addEventListener('click', () => {
				let commentID = this._commentDeleteButton[i].getAttribute('data-comment-id');
				actionPost.deleteComment(commentID);

				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				for (let j = 0; j < comments.length; ++j) {
					if (comments[j].id === Number(commentID)) {
						comments.splice(j, 1);
						break;
					}
				}
				postsStore$1.comments.set(postID, comments);

				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						postsStore$1.posts[i].comments_amount--;
					}
				}
				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditButton.length; ++i) {
			this._commentEditButton[i].addEventListener('click', () => {
				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				let commentID = Number(this._commentDeleteButton[i].getAttribute('data-comment-id'));

				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = true;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditSaveButton.length; ++i) {
			this._commentEditSaveButton[i].addEventListener('click', () => {
				let newCommentText = this._commentEditInput[i].value.trim();
				if (this._commentEditInput[i].value.trim() !== '') {
					let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));
					actionPost.editComment(commentID, newCommentText);

					let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
					let comments = postsStore$1.comments.get(postID);
					for (let i = 0; i < comments.length; ++i) {
						if (comments[i].id === commentID) {
							comments[i].editing_mode = false;
							comments[i].text = newCommentText;
						}
					}

				}
			});
		}

		for (let i = 0; i < this._commentEditCancelButton.length; ++i) {
			this._commentEditCancelButton[i].addEventListener('click', () => {
				let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));

				let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);
				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = false;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._showMoreCommentsButton.length; ++i) {
			this._showMoreCommentsButton[i].addEventListener('click', () => {
				let postID = Number(this._showMoreCommentsButton[i].getAttribute('data-post-id'));

				console.log(postID);
				let lastCommentDate = postsStore$1.comments.get(postID).at(-1).raw_creation_date;
				console.log(lastCommentDate);


				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						actionPost.getComments(postID, this._commentBatchToLoad, lastCommentDate);
						break;
					}
				}


				// this.updatePage();
			});
		}

		for (let i = 0; i < this._postsTexts.length; i++) {
			const text = this._postsTexts[i].textContent;
			if (text.split('\n').length > maxTextStrings || text.length > maxTextLength) {
				const post = this._postsTexts[i];
				let shortText;

				if (text.length > maxTextLength) {
					shortText = text.slice(0, maxTextLength) + '...';
				} else {
					const ind = text.indexOf('\n', text.indexOf('\n', text.indexOf('\n') + 1) + 1);
					shortText = text.slice(0, ind) + '...';
				}
				post.textContent = shortText;

				const openButton = document.createElement('div');
				openButton.textContent = 'Показать еще';
				openButton.style.color = '#9747FF';
				openButton.style.cursor = 'pointer';

				post.appendChild(openButton);
				openButton.addEventListener('click', function() {
					post.textContent = text;
				});
			}
		}

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				this.isEdit = this._editPosts[i].getAttribute("data-id");
				this.isCreate = false;
				actionPost.getPostsById(this.isEdit, 1);
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				this.isCreate = true;
				this.isEdit = false;
				super.render();
				this._text.focus();
			});
		}

		if (this._addPhotoToPost) {
			this._addPhotoToPost.addEventListener('click', () => {
				this._createPosts.click();
				this._addPhotoToPostPic.click();
			});
		}

		if (this._editBtn) {
			this._editBtn.addEventListener('click', () => {
				actionPost.editPost(this._text.value, this.isEdit);
				this.isEdit = false;
			});
		}

		if (this._createBtn) {
			this._createBtn.addEventListener('click', () => {
				actionPost.createPostUser(userStore$1.user.user_link, userStore$1.user.user_link, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				postsStore$1.attachments = [];
				super.render();
			});
		}

		if (this._addPhotoToPostPic) {
			this._addPhotoToPostPic.addEventListener('click', ()=> {
				if (postsStore$1.attachments === null) {
					postsStore$1.attachments = [];
				}
				if (postsStore$1.attachments.length >= 10) {
					return;
				}
				postsStore$1.text = this._text.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = function (e) {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore$1.attachments.length) {
								id = postsStore$1.attachments[postsStore$1.attachments.length-1].id + 1;
							}
							if (Router$1._getSearch(newUrl).type === 'img') {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'img'});
								postsStore$1.addAttachments.push(newUrl);
							} else {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
								postsStore$1.addAttachments.push(newUrl + `&filename=${file.name}`);
							}

							postsStore$1._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore$1.attachments.length; i++) {
					if (postsStore$1.attachments[i].id.toString() === imgId) {
						index = i;
						postsStore$1.deleteAttachments.push(Ajax$1.imgUrlBackConvert(postsStore$1.attachments[i].url));
						break;
					}
				}
				if (index > -1) {
					postsStore$1.attachments.splice(index, 1);
				}

				postsStore$1.text = this._text.value;
				postsStore$1._refreshStore();
			});
		}
	}


	showPage() {
		actionUser.getProfile(() => { actionPost.getFriendsPosts(15); });
	}

	_preRender() {
		this._template = Handlebars.templates.feed;

		for (let i = 0; i < postsStore$1.posts.length; ++i) {
			postsStore$1.posts[i].comments = postsStore$1.comments.get(postsStore$1.posts[i].id);
			postsStore$1.posts[i].has_next = postsStore$1.haveCommentsContinuation.get(postsStore$1.posts[i].id);
		}


		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData:
			{
				createPostData:
				{
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: userStore$1.user.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: userStore$1.user.avatar_url, attachments: postsStore$1.attachments, text: postsStore$1.text, buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, buttonData1: { text: 'Отменить', jsId: 'js-back-post-btn' },}
				},
				postList: postsStore$1.posts
			},
		};
		postsStore$1.text = '';

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore$1.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore$1.curPost.id;
			this._context.postAreaData.createPostData.create.attachments= postsStore$1.curPost.attachments;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
}

/**
 * action-ы для работы с друзьями 
 */
const actionFriends = {
    /**
     * action для получения списка друзей по ссылке пользователя
     */

    /**
     * action для получения списка друзей по ссылке пользователя
     * @param {*} link - ссылка пользователя
     * @param {*} count - количество возвращаемых друзей
     * @param {*} offset - смещение
     */
    getFriends(link, count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getFriends',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения списка друзей по ссылке пользователя
     * @param {*} link - ссылка пользователя
     */
    isFriend(link) {
        Dispatcher$1.dispatch({
            actionName: 'isFriend',
            link,
        });
    },
    /**
     * action для получения списка всех пользователей
     * @param {*} count - количество возвращаемых пользователей
     * @param {*} offset - смещение
     */
    getUsers(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getUsers',
            count,
            offset,
        });
    },
    /**
     * action для получения списка пользователей, которые не являются друзьями
     * @param {*} count - количество возвращаемых пользователей
     * @param {*} offset - смещение
     */
    getNotFriends(count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getNotFriends',
            count,
            offset,
        });
    },
    /**
     * action для получения подписок пользователя
     * @param {*} link - ссылка на пользователя
     * @param {*} count - количество аозвращаемых подписок
     * @param {*} offset - смещение
     */
    getSubscriptions(link, count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getSub',
            type: 'out',
            link,
            count,
            offset,
        });
    },
    /**
     * action для получения подписчиков пользователя
     * @param {*} link - ссылка на пользователя
     * @param {*} count - количество аозвращаемых подписок
     * @param {*} offset - смещение
     */
    getSubscribers(link, count, offset) {
        Dispatcher$1.dispatch({
            actionName: 'getSub',
            type: 'in',
            link,
            count,
            offset,
        });
    },
    /**
     * action, который используется, чтобы подписаться на пользователя
     * @param {*} link - ссылка на пользователя
     */
    sub(link) {
        Dispatcher$1.dispatch({
            actionName: 'sub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отписаться от пользователя
     * @param {*} link - ссылка на пользователя
     */
    unsub(link) {
        Dispatcher$1.dispatch({
            actionName: 'unsub',
            link,
        });
    },
    /**
     * action, который используется, чтобы отклонить заявку
     * @param {*} link - ссылка на человека, которому отменяем заявку
     */
    reject(link) {
        Dispatcher$1.dispatch({
            actionName: 'reject',
            link,
        });
    },
};

/**
 * класс, хранящий информацию о друзьях
 */
class friendsStore {
    /**
     * @constructor
     * конструктор класса 
     */
    constructor() {
        this._callbacks = [];

        this.friends = [];
        this.notFriends = [];
        this.users = [];

        this.subscribers = [];
        this.subscriptions = [];

        this.isMyFriend = false;

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'getFriends':
                await this._getFriends(action.link, action.count, action.offset);
                break;
            case 'isFriend':
                await this._isFriend(action.link);
                break;
            case 'getNotFriends':
                await this._getNotFriends(action.link, action.count, action.offset);
                break;
            case 'getUsers':
                await this._getUsers(action.count, action.offset);
                break;
            case 'getSub':
                await this._getSub(action.type, action.link, action.count, action.offset);
                break;
            case 'sub':
                await this._sub(action.link);
                break;
            case 'unsub':
                await this._unsub(action.link);
                break;
            case 'reject':
                await this._reject(action.link);
                break;
            default:
                return;
        }
    }

    /**
     * Метод, реализующий реакцию на получение списка друзей
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getFriends(link, count, offset) {
        const request = await Ajax$1.getFriends(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.friends.forEach((friend) => {
                friend.isFriend = true;
                if (!friend.avatar_url) {
                    friend.avatar_url = headerConst.avatarDefault;
                } else {
                    friend.avatar_url = Ajax$1.imgUrlConvert(friend.avatar_url);
                }
                if (!friend.city) {
                    friend.city = 'город не указан';
                }
            });

            this.friends = response.body.friends;
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение списка друзей
     * @param {String} link - ссылка пользователя
     */
    async _isFriend(link) {
        const request = await Ajax$1.isFriend(link);

        this.isMyFriend = false;
        if (request.status === 200) {
            const response = await request.json();
            if (response.body.status === 'friend' || response.body.status === 'subscribed') {
                this.isMyFriend = true;
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('isFriend error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение пользователей, которые не являются друзьями
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых друзей
     * @param {Number} offset - смещение
     */
    async _getNotFriends(link, count, offset) {
        const request = await Ajax$1.getNotFriends(link, count, offset);
        const response = await request.json();

        this.notFriends = [];
        if (request.status === 200) {
            response.body.profiles.forEach((friend) => {
                friend.isUser = true;
                if (!friend.avatar_url) {
                    friend.avatar_url = headerConst.avatarDefault;
                } else {
                    friend.avatar_url = Ajax$1.imgUrlConvert(friend.avatar_url);
                }
                if (!friend.city) {
                    friend.city = 'город не указан';
                }
                this.notFriends.push(friend);
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение пользователей
     * @param {Number} count - количество получаемых пользователей
     * @param {Number} offset - смещение
     */
    async _getUsers(count, offset) {
        const request = await Ajax$1.getUsers(count, offset);
        const response = await request.json();

        this.users = [];
        if (request.status === 200) {
            response.body.profiles.forEach((user) => {
                if (!user.avatar_url) {
                    user.avatar_url = headerConst.avatarDefault;
                } else {
                    user.avatar_url = Ajax$1.imgUrlConvert(user.avatar_url);
                }
                if (!user.city) {
                    user.city = 'город не указан';
                }
                if (user.user_link !== userStore$1.user.user_link) {
                    this.users.push(user);
                }
            });

        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на получение подписок
     * @param {String} type - тип подписки
     * @param {String} link - ссылка пользователя
     * @param {Number} count - количество получаемых подписок
     * @param {Number} offset - смещение
     */
    async _getSub(type, link, count, offset) {
        const request = await Ajax$1.getSub(type, link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (type === 'in') {
                this.subscribers = response.body.subs;
                this.subscribers.forEach((sub) => {
                    if (!sub.avatar_url) {
                        sub.avatar_url = headerConst.avatarDefault;
                    } else {
                        sub.avatar_url = Ajax$1.imgUrlConvert(sub.avatar_url);
                    }
                    sub.isSubscriber = true;
                });
            } else {
                this.subscriptions = response.body.subs;
                this.subscriptions.forEach((sub) => {
                    if (!sub.avatar_url) {
                        sub.avatar_url = headerConst.avatarDefault;
                    } else {
                        sub.avatar_url = Ajax$1.imgUrlConvert(sub.avatar_url);
                    }
                    sub.isSubscribed = true;
                });
            }
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на подписку
     * @param {String} link - ссылка на пользователя
     */
    async _sub(link) {
        const request = await Ajax$1.sub(link);

        if (request.status === 200) {
            actionFriends.getFriends(userStore$1.user.user_link, 15, 0);
            actionFriends.getNotFriends(15, 0);
            actionFriends.getSubscribers(userStore$1.user.user_link, 15);
            actionFriends.getSubscriptions(userStore$1.user.user_link, 15);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на отмену подписки
     * @param {String} link - ссылка на пользователя
     */
    async _unsub(link) {
        const request = await Ajax$1.unsub(link);

        if (request.status === 200) {
            actionFriends.getFriends(userStore$1.user.user_link, 15, 0);
            actionFriends.getNotFriends(15, 0);
            actionFriends.getSubscribers(userStore$1.user.user_link, 15);
            actionFriends.getSubscriptions(userStore$1.user.user_link, 15);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }

    /**
     * Метод, реализующий реакцию на отмену заявки
     * @param {String} link - ссылка на пользователя
     */
    async _reject(link) {
        const request = await Ajax$1.reject(link);

        if (request.status === 200) ; else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('error');
        }

        this._refreshStore();
    }
}

var friendsStore$1 = new friendsStore();

class FriendsView extends BaseView {
	constructor() {
		super();
		this._addHandlebarsPartial();

		this._jsId = 'friends';
		this.curPage = false;

		friendsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
		searchStore.registerCallback(this.updateSearchList.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
		Handlebars.registerPartial('button', Handlebars.templates.button);
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
		Handlebars.registerPartial('search', Handlebars.templates.search);
		Handlebars.registerPartial('friend', Handlebars.templates.friend);
	}

	_addPagesElements() {
		super.addPagesElements();

		this._friendsItem.style.color = activeColor;

		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._feedBtn = document.getElementById('js-logo-go-feed');
		this._friendsBtn = document.getElementById('js-menu-friends');
		this._subscribersBtn = document.getElementById('js-menu-subscribers');
		this._subscriptionsBtn = document.getElementById('js-menu-subscriptions');
		this._findFriendsBtn = document.getElementById('js-menu-find-friends');

		switch (window.location.pathname) {
			case '/friends':
				this._friendsBtn.style.color = activeColor;
				break;
			case '/subscribers':
				this._subscribersBtn.style.color = activeColor;
				break;
			case '/subscriptions':
				this._subscriptionsBtn.style.color = activeColor;
				break;
			case '/findFriends':
				this._findFriendsBtn.style.color = activeColor;
				break;
		}

		this._feedBtn = document.getElementById('js-logo-go-feed');
		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._friendsItem.style.color = activeColor;
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');

		//this._goToProfile = document.getElementsByClassName('friend-menu-item-page');
		this._goToMsg = document.getElementsByClassName('js-friend-go-msg');
		this._deleteFriend = document.getElementsByClassName('friend-menu-item-delete');
		this._addUser = document.getElementsByClassName('js-friend-add');
		this._unsubUser = document.getElementsByClassName('js-friend-unsub');
		this._deleteUser = document.getElementsByClassName('js-friend-delete');

		this._usersList = document.getElementById("js-users-list");
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
            Router$1.go('/settings', false);
        });

		this._myPageItem.addEventListener('click', () => {
			Router$1.go('/user', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router$1.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router$1.go('/feed', false);
		});

		this._friendsBtn.addEventListener('click', () => {
			Router$1.go('/friends', false);
		});

		this._subscribersBtn.addEventListener('click', () => {
			this._subscribersBtn.style.color = activeColor;
			Router$1.go('/subscribers', false);
		});

		this._subscriptionsBtn.addEventListener('click', () => {
			this._subscriptionsBtn.style.color = activeColor;
			Router$1.go('/subscriptions', false);
		});

		this._findFriendsBtn.addEventListener('click', () => {
			this._findFriendsBtn.style.color = activeColor;
			Router$1.go('/findFriends', false);
		});

		this._feedBtn.addEventListener('click', () => {
            Router$1.go('/feed', false);
        });

		this._groupsItem.addEventListener('click', () => {
            Router$1.go('/groups', false);
        });

		for (let i = 0; i < this._addUser.length; i++) {
			this._addUser[i].addEventListener('click', () => {
				const userId = this._addUser[i].getAttribute("data-id");
				actionFriends.sub(userId);
			});
		}

		for (let i = 0; i < this._deleteFriend.length; i++) {
			this._deleteFriend[i].addEventListener('click', () => {
				const userId = this._deleteFriend[i].getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		for (let i = 0; i < this._unsubUser.length; i++) {
			this._unsubUser[i].addEventListener('click', () => {
				const userId = this._unsubUser[i].getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		for (let i = 0; i < this._deleteUser.length; i++) {
			this._deleteUser[i].addEventListener('click', () => {
				const userId = this._deleteUser[i].getAttribute("data-id");
				actionFriends.reject(userId); //пока не работает
			});
		}

		for (let i = 0; i < this._goToProfile.length; i++) {
			this._goToProfile[i].addEventListener('click', () => {
				const userId = this._goToProfile[i].getAttribute("data-id");
				Router$1.go('/user?link=' + userId, false);
			});
		}

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const userId = this._goToMsg[i].getAttribute("data-id");
				actionMessage.chatCheck(userId, () => {
					if (localStorage.getItem('chatFriendId')) {
						localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
						Router$1.go('/chat', false);
						actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
					} else {
						actionMessage.chatCreate(userId, () => {
							if (localStorage.getItem('chatId')) {
								Router$1.go('/chat', false);
								actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
							}
						});
					}
				});
			});
		}


		switch (window.location.pathname) {
			case '/findFriends':
				this._searchAreaInput.addEventListener('keyup', () => {
					if (this._searchAreaInput.value === "") {
						localStorage.removeItem("searchQuery");
						Router$1.go('/findFriends');
						return
					}
					this.interruptTimer();

					this.startTimer(250, () => {
						if (this._searchAreaInput.value !== "") {
							localStorage.setItem("searchQuery", this._searchAreaInput.value);
							actionSearch.search(this._searchAreaInput.value);
						}
					});
				});
				break

		}
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		actionUser.getProfile(() => {
			actionFriends.getFriends(userStore$1.user.user_link, 15, 0);
			actionFriends.getNotFriends(15, 0);
			actionFriends.getSubscribers(userStore$1.user.user_link, 15);
			actionFriends.getSubscriptions(userStore$1.user.user_link, 15);
		});
	}

	updateSearchList() {
		if (this.curPage) {
			if (!userStore$1.user.isAuth) {
				Router$1.go('/signIn');
			} else {
				this._renderNewSearchList();
			}
		}
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore$1.user.isAuth) {
				Router$1.go('/signIn');
			} else {
				this._render();
			}
		}
	}


	_renderNewSearchList() {
		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;
		console.log(searchStore.userSearchItems);
		let res;
		let info;
		switch (window.location.pathname) {
			case '/findFriends':
				res = searchStore.userSearchItems;
				info = 'По данному запросу не найдено людей';
				break;
		}
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			friendsData: res,
			textInfo: {
				textInfo: info,
			},
			menuInfo: friendsMenuInfo,
		};

		Router$1.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
		this._searchAreaInput.value = localStorage.getItem("searchQuery");
		this._searchAreaInput.focus();
	}

	_preRender() {
		this._template = Handlebars.templates.friends;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/friends':
				res = friendsStore$1.friends;
				info = 'У вас пока нет друзей';
				break;
			case '/subscribers':
				res = friendsStore$1.subscribers;
				info = 'У вас пока нет подписчиков';
				break;
			case '/subscriptions':
				res = friendsStore$1.subscriptions;
				info = 'У вас пока нет подписок';
				break;
			case '/findFriends':
				res = friendsStore$1.notFriends;
				break;
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			friendsData: res,
			textInfo: {
				textInfo: info,
			},
			menuInfo: friendsMenuInfo,
		};

	}

	_render() {
		this._preRender();
		Router$1.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();

		let query = localStorage.getItem("searchQuery");
		if (window.location.pathname === "/findFriends" && query != null && query !== "") {
			this._searchAreaInput.value = query;
			this._searchAreaInput.focus();
			actionSearch.search(this._searchAreaInput.value);
		} else {
			localStorage.removeItem("searchQuery");
			this._searchAreaInput.focus();
		}
	}
}

class GroupsView extends BaseView {
	constructor() {
		super();
		this._jsId = 'groups';
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
		searchStore.registerCallback(this.updateSearchList.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._groupsItem.style.color = activeColor;
		this._groupsBtn = document.getElementById('js-menu-groups');
		this._manageGroupsBtn = document.getElementById('js-menu-manage-groups');
		this._findGroupsBtn = document.getElementById('js-menu-find-groups');
		this._popularGroupsBtn = document.getElementById('js-menu-popular-groups');

		this._goToProfile = document.getElementsByClassName('js-go-to-profile');
		this._goToGroup = document.getElementsByClassName('js-go-to-group');

		this.newGroupWindow = document.getElementById("newGroup");

		switch (window.location.pathname) {
			case '/groups':
				this._groupsBtn.style.color = activeColor;
				break;
			case '/manageGroups':
				this._manageGroupsBtn.style.color = activeColor;
				break;
			case '/findGroups':
				this._findGroupsBtn.style.color = activeColor;
				break;
			case '/popularGroups':
				this._popularGroupsBtn.style.color = activeColor;
				break;
		}

		this._titleField = document.getElementById('js-title-input');
		this._titleErrorField = document.getElementById('js-title-error');
		this._infoField = document.getElementById('js-info-input');
		this._infoErrorField = document.getElementById('js-info-error');
		this._selectField = document.getElementById('js-select');
		this._checkboxField = document.getElementById('js-group-checkbox');
		this._addGroupBtn = document.getElementById('js-add-group-btn');

		this._unsubGroup = document.getElementsByClassName('groupItem-menu-item-delete');
	}

	addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._settingsBtn.addEventListener('click', () => {
			Router$1.go('/settings', false);
		});

		this._groupsItem.addEventListener('click', () => {
			Router$1.go('/groups', false);
		});

		this._feedBtn.addEventListener('click', () => {
			Router$1.go('/feed', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router$1.go('/user', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router$1.go('/message', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router$1.go('/feed', false);
		});

		this._friendsItem.addEventListener('click', () => {
			Router$1.go('/friends', false);
		});

		this._manageGroupsBtn.addEventListener('click', () => {
			this._manageGroupsBtn.style.color = activeColor;
			Router$1.go('/manageGroups', false);
		});

		this._findGroupsBtn.addEventListener('click', () => {
			this._findGroupsBtn.style.color = activeColor;
			Router$1.go('/findGroups', false);
		});

		this._popularGroupsBtn.addEventListener('click', () => {
			this._popularGroupsBtn.style.color = activeColor;
			Router$1.go('/popularGroups', false);
		});

		this._groupsBtn.addEventListener('click', () => {
			this._groupsBtn.style.color = activeColor;
			Router$1.go('/groups', false);
		});

		this.newGroupWindow.addEventListener('click', () => {
			let errField = document.getElementById(NewGroupConst.inputInfo.jsIdError);
			errField.textContent = "";
		}, true);


		if (this._addGroupBtn !== null) {
			this._addGroupBtn.addEventListener('click', () => {
                if (this._titleField.value.trim() === "") {
					let errField = document.getElementById(NewGroupConst.inputInfo.jsIdError);
					errField.textContent = "Это поле не может быть пустым";
					return
                }
				let privacy;
				if (this._selectField.value == 'Открытая группа') {
					privacy = 'open';
				} else {
					privacy = 'close';
				}
				actionGroups.createGroup({title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._checkboxField.checked});
				Router$1.go('/manageGroups', false);
			});
		}

		for (let i = 0; i < this._goToGroup.length; i++) {
			this._goToGroup[i].addEventListener('click', () => {
				const groupId = this._goToGroup[i].getAttribute("data-id");
				Router$1.go('/group?link=' + groupId, false);
			});
		}

		switch (window.location.pathname) {
			case '/findGroups':
				this._searchAreaInput.addEventListener('keyup', () => {
					if (this._searchAreaInput.value === "") {
						localStorage.removeItem("searchQuery");
						Router$1.go('/findGroups');
						return
					}
					this.interruptTimer();

					this.startTimer(250, () => {
						if (this._searchAreaInput.value !== "") {
							localStorage.setItem("searchQuery", this._searchAreaInput.value);
							actionSearch.search(this._searchAreaInput.value);
						}
					});
				});
				break

		}
	}

	updateSearchList() {
		if (this.curPage) {
			if (!userStore$1.user.isAuth) {
				Router$1.go('/signIn');
			} else {
				this._renderNewSearchList();
			}
		}
	}

	_renderNewSearchList() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/findGroups':
				res = searchStore.communitySearchItems;
				info = 'По данному запросу не найдены сообщества';
				break;
		}
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			groupsData: res,
			textInfo: {
				textInfo: info,
			},
			groupsPathData: groupsConst,
			menuInfo: friendsMenuInfo,
		};

		Router$1.rootElement.innerHTML = this._template(this._context);
		this.addPagesElements();
		this.addPagesListener();
		this._searchAreaInput.value = localStorage.getItem("searchQuery");
		this._searchAreaInput.focus();
	}

	showPage() {
		actionUser.getProfile(() => {
			actionGroups.getGroups(15, 0);
			actionGroups.getmanageGroups(15, 0);
			actionGroups.getNotGroups(15, 0);
			//actionGroups.getPopularGroups(15, 0);
		});
	}

	_preRender() {
		this._template = Handlebars.templates.groups;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		let res;
		let info;
		switch (window.location.pathname) {
			case '/groups':
				res = groupsStore$1.groups;
				info = 'Вы не подписаны на сообщества';
				break;
			case '/manageGroups':
				res = groupsStore$1.manageGroups;
				info = 'У вас пока нет сообществ';
				break;
			case '/findGroups':
				res = groupsStore$1.findGroups;
                info = 'Сообщества не найдены';
				break;
			case '/popularGroups':
				res = groupsStore$1.popularGroups;
                info = 'Сообщества не найдены';
				break;
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			groupsData: res,
			textInfo: {
				textInfo: info,
			},
			groupsPathData: groupsConst,
			newGroupData: NewGroupConst,
			NewGroupError: groupsStore$1.error,
		};
	}


	updatePage() {
		if (this.curPage) {
			if (!userStore$1.user.isAuth) {
				Router$1.go('/signIn');
			} else {
				this.render();
				this._searchAreaInput.focus();
			}
		}
	}
}

let GroupView$1 = class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'group';
		this._groupLink = null;

		this._commentBatchToLoad = 5;

		this.isCreate = false;
		this.isEdit = false;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
		postsStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._groupSettingsBtn = document.getElementById('js-group-settings-btn');
		this._groupSub = document.getElementById('js-group-sub-btn');
		this._groupUnsub = document.getElementById('js-group-unsub-btn');
		this._groupDelete = document.getElementById('js-group-delete-btn');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
		this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');


		this._createPosts = document.getElementById('js-create-post');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');

		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

		this._addPhotoToPostPic = document.getElementById('js-add-photo-to-post-pic');
		this._addPhotoToPost = document.getElementById('js-add-photo-to-post');
		this._removeImg = document.getElementsByClassName('close-button');

		this._commentsAreas = document.getElementsByClassName("comments-area");
		this._commentsButtons = document.getElementsByClassName("post-buttons-comment");
		this._sendCommentButtons = document.getElementsByClassName('create-comment__send-icon');
		this._commentInput = document.getElementsByClassName('depeche-multiline-input');

		this._commentDeleteButton = document.getElementsByClassName("comment-operations__delete");

		this._commentEditButton = document.getElementsByClassName("comment-operations__update");
		this._commentEditSaveButton = document.getElementsByClassName("submit-comment-edit-button");
		this._commentEditCancelButton = document.getElementsByClassName("cancel-comment-edit-button");
		this._commentEditInput = document.getElementsByClassName("comment-edit-input");

		this._showMoreCommentsButton = document.getElementsByClassName("show-more-block");


		this._text = document.getElementById('js-edit-post-textarea');
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		if (this._text) {
			this._text.focus();

			this._editBtn = document.getElementById('js-edit-post-btn');
			let textarea = document.getElementsByTagName('textarea');

			textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
			textarea[0].addEventListener("input", OnInput, false);
		}
	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		if (this._groupSub) {
			this._groupSub.addEventListener('click', () => {
				actionGroups.groupSub(this._groupLink);
			});
		}

		if (this._groupUnsub) {
			this._groupUnsub.addEventListener('click', () => {
				actionGroups.groupUnsub(this._groupLink);
			});
		}

		if (this._groupDelete) {
			this._groupDelete.addEventListener('click', () => {
				actionGroups.deleteGroup(this._groupLink);
			});
		}

		for (let i = 0; i < this._likePosts.length; i++) {
			this._likePosts[i].addEventListener('click', () => {
				const postId = this._likePosts[i].getAttribute("data-id");
				actionPost.likePost(Number(postId));
			});
		}

		for (let i = 0; i < this._dislikePosts.length; i++) {
			this._dislikePosts[i].addEventListener('click', () => {
				const postId = this._dislikePosts[i].getAttribute("data-id");
				actionPost.dislikePost(Number(postId));
			});
		}


		for (let i = 0; i < this._commentsButtons.length; i++) {
			this._commentsButtons[i].addEventListener('click', () => {
				if (postsStore$1.comments.get(postsStore$1.posts[i].id) === undefined || postsStore$1.comments.get(postsStore$1.posts[i].id).length === 0) {
					actionPost.getComments(postsStore$1.posts[i].id, this._commentBatchToLoad);
				} else {
					postsStore$1.comments.delete(postsStore$1.posts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");
					if (showMoreCommentButton.length !== 0) {
						this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
						postsStore$1.haveCommentsContinuation.delete(postsStore$1.posts[i].id);
					}
				}
			});
		}

		for (let i = 0; i < this._sendCommentButtons.length; ++i) {
			this._sendCommentButtons[i].addEventListener('click', () => {
				if (this._commentInput[i].value.trim() !== '') {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});

		}

		for (let i = 0; i < this._commentInput.length; ++i) {
			this._commentInput[i].addEventListener('keyup', (event) => {
				if (this._commentInput[i].value.trim() !== '' && event.code === 'Enter' && document.activeElement === this._commentInput[i]) {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});
		}

		for (let i = 0; i < this._commentDeleteButton.length; ++i) {
			this._commentDeleteButton[i].addEventListener('click', () => {
				let commentID = this._commentDeleteButton[i].getAttribute('data-comment-id');
				actionPost.deleteComment(commentID);

				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				for (let j = 0; j < comments.length; ++j) {
					if (comments[j].id === Number(commentID)) {
						comments.splice(j, 1);
						break;
					}
				}
				postsStore$1.comments.set(postID, comments);

				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						postsStore$1.posts[i].comments_amount--;
					}
				}
				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditButton.length; ++i) {
			this._commentEditButton[i].addEventListener('click', () => {
				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				let commentID = Number(this._commentDeleteButton[i].getAttribute('data-comment-id'));

				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = true;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditSaveButton.length; ++i) {
			this._commentEditSaveButton[i].addEventListener('click', () => {
				let newCommentText = this._commentEditInput[i].value.trim();
				if (this._commentEditInput[i].value.trim() !== '') {
					let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));
					actionPost.editComment(commentID, newCommentText);

					let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
					let comments = postsStore$1.comments.get(postID);
					for (let i = 0; i < comments.length; ++i) {
						if (comments[i].id === commentID) {
							comments[i].editing_mode = false;
							comments[i].text = newCommentText;
						}
					}

				}
			});
		}

		for (let i = 0; i < this._commentEditCancelButton.length; ++i) {
			this._commentEditCancelButton[i].addEventListener('click', () => {
				let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));

				let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);
				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = false;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._showMoreCommentsButton.length; ++i) {
			this._showMoreCommentsButton[i].addEventListener('click', () => {
				let postID = Number(this._showMoreCommentsButton[i].getAttribute('data-post-id'));

				console.log(postID);
				let lastCommentDate = postsStore$1.comments.get(postID).at(-1).raw_creation_date;
				console.log(lastCommentDate);


				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						actionPost.getComments(postID, this._commentBatchToLoad, lastCommentDate);
						break;
					}
				}


				// this.updatePage();
			});
		}

		for (let i = 0; i < this._postsTexts.length; i++) {
			const text = this._postsTexts[i].textContent;
			if (text.split('\n').length > maxTextStrings || text.length > maxTextLength) {
				const post = this._postsTexts[i];
				let shortText;

				if (text.length > maxTextLength) {
					shortText = text.slice(0, maxTextLength) + '...';
				} else {
					const ind = text.indexOf('\n', text.indexOf('\n', text.indexOf('\n') + 1) + 1);
					shortText = text.slice(0, ind) + '...';
				}
				post.textContent = shortText;

				const openButton = document.createElement('div');
				openButton.textContent = 'Показать еще';
				openButton.style.color = '#9747FF';
				openButton.style.cursor = 'pointer';

				post.appendChild(openButton);
				openButton.addEventListener('click', function() {
					post.textContent = text;
				});
			}
		}

		if (this._groupSettingsBtn) {
			this._groupSettingsBtn.addEventListener('click', () => {
				Router$1.go('/settingsGroup?link=' + this._groupLink, false);
			});
		}

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				this.isEdit = this._editPosts[i].getAttribute("data-id");
				this.isCreate = false;
				actionPost.getPostsById(this.isEdit, 1);
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				this.isCreate = true;
				this.isEdit = false;
				super.render();
				this._text.focus();
			});
		}

		if (this._addPhotoToPost) {
			this._addPhotoToPost.addEventListener('click', () => {
				this._createPosts.click();
				this._addPhotoToPostPic.click();
			});
		}

		if (this._editBtn) {
			this._editBtn.addEventListener('click', () => {
				actionPost.editPost(this._text.value, this.isEdit);
				this.isEdit = false;
			});
		}

		if (this._createBtn) {
			this._createBtn.addEventListener('click', () => {
				actionPost.createPostCommunity(userStore$1.user.user_link, this._groupLink, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				postsStore$1.attachments = [];
				super.render();
			});
		}

		if (this._addPhotoToPostPic) {
			this._addPhotoToPostPic.addEventListener('click', ()=> {
				if (postsStore$1.attachments === null) {
					postsStore$1.attachments = [];
				}
				if (postsStore$1.attachments.length >= 10) {
					return;
				}
				postsStore$1.text = this._text.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = function (e) {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore$1.attachments.length) {
								id = postsStore$1.attachments[postsStore$1.attachments.length-1].id + 1;
							}
							if (Router$1._getSearch(newUrl).type === 'img') {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'img'});
								postsStore$1.addAttachments.push(newUrl);
							} else {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
								postsStore$1.addAttachments.push(newUrl + `&filename=${file.name}`);
							}

							postsStore$1._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore$1.attachments.length; i++) {
					if (postsStore$1.attachments[i].id.toString() === imgId) {
						index = i;
						postsStore$1.deleteAttachments.push(Ajax$1.imgUrlBackConvert(postsStore$1.attachments[i].url));
						break;
					}
				}
				if (index > -1) {
					postsStore$1.attachments.splice(index, 1);
				}

				postsStore$1.text = this._text.value;
				postsStore$1._refreshStore();
			});
		}
	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, 15); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink); });
		} else {
			Router$1.go('/groups', false);
		}
	}


	_preRender() {
		this._template = Handlebars.templates.group;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		for (let i = 0; i < postsStore$1.posts.length; ++i) {
			postsStore$1.posts[i].comments = postsStore$1.comments.get(postsStore$1.posts[i].id);
			postsStore$1.posts[i].has_next = postsStore$1.haveCommentsContinuation.get(postsStore$1.posts[i].id);
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore$1.curGroup,

			postAreaData: {
				createPostData: {
					displayNone: !groupsStore$1.curGroup.isAdmin,
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: groupsStore$1.curGroup.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: groupsStore$1.curGroup.avatar_url, attachments: postsStore$1.attachments , text: postsStore$1.text, buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, buttonData1: { text: 'Отменить', jsId: 'js-back-post-btn' },}
				},
				postList: postsStore$1.posts},
		};
		postsStore$1.text = '';

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore$1.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore$1.curPost.id;
			this._context.postAreaData.createPostData.create.attachments= postsStore$1.curPost.attachments;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
};

class ProfileView extends BaseView {
	constructor() {
		super();

		this._jsId = 'profile';
		this.curPage = false;
		this._userLink = null;

		this._commentBatchToLoad = 5;

		this.isCreate = false;
		this.isEdit = false;
	}

	addStore() {
		postsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		if (userStore$1.user.user_link === this._userLink) {
			this._myPageItem.style.color = activeColor;
		}

		this._profileSettingsBtn = document.getElementById('js-profile-settings-btn');

		this._createPosts = document.getElementById('js-create-post');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');

		this._removeFriend = document.getElementById('js-friend-remove');
		this._addFriend = document.getElementById('js-friend-add');

		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');
		this._goMsg = document.getElementById('js-go-msg');

		this._addPhotoToPostPic = document.getElementById('js-add-photo-to-post-pic');
		this._addPhotoToPost = document.getElementById('js-add-photo-to-post');
		this._removeImg = document.getElementsByClassName('close-button');

		this._dropContent = document.getElementById('js-drop-content');

    this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');
		this._commentsAreas = document.getElementsByClassName("comments-area");
		this._commentsButtons = document.getElementsByClassName("post-buttons-comment");
		this._sendCommentButtons = document.getElementsByClassName('create-comment__send-icon');
		this._commentInput = document.getElementsByClassName('depeche-multiline-input');

		this._commentDeleteButton = document.getElementsByClassName("comment-operations__delete");

		this._commentEditButton = document.getElementsByClassName("comment-operations__update");
		this._commentEditSaveButton = document.getElementsByClassName("submit-comment-edit-button");
		this._commentEditCancelButton = document.getElementsByClassName("cancel-comment-edit-button");
		this._commentEditInput = document.getElementsByClassName("comment-edit-input");

		this._showMoreCommentsButton = document.getElementsByClassName("show-more-block");

		this._text = document.getElementById('js-edit-post-textarea');
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		if (this._text) {
			this._text.focus();

			this._editBtn = document.getElementById('js-edit-post-btn');
			let textarea = document.getElementsByTagName('textarea');

			textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
			textarea[0].addEventListener("input", OnInput, false);
		}
	}

	addPagesListener() {
		super.addPagesListener();

		this._settingsBtn.addEventListener('click', () => {
			Router$1.go('/settings', false);
		});

		if (this._profileSettingsBtn) {
			this._profileSettingsBtn.addEventListener('click', () => {
				Router$1.go('/settings', false);
			});
		}

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		for (let i = 0; i < this._likePosts.length; i++) {
			this._likePosts[i].addEventListener('click', () => {
				const postId = this._likePosts[i].getAttribute("data-id");
				actionPost.likePost(Number(postId));
			});
		}

		for (let i = 0; i < this._dislikePosts.length; i++) {
			this._dislikePosts[i].addEventListener('click', () => {
				const postId = this._dislikePosts[i].getAttribute("data-id");
				actionPost.dislikePost(Number(postId));
			});
		}

		if (this._goMsg) {
			this._goMsg.addEventListener('click', () => {
				const userId = this._goMsg.getAttribute("data-id");
				actionMessage.chatCheck(userId, () => {
					if (localStorage.getItem('chatFriendId')) {
						localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
						Router$1.go('/chat', false);
						actionMessage.getChatsMsg(localStorage.getItem('chatId'), 15);
					} else {
						actionMessage.chatCreate(userId, () => {
							if (localStorage.getItem('chatId')) {
								Router$1.go('/chat', false);
								actionMessage.getChatsMsg(localStorage.getItem('chatId'), 15);
							}
						});
					}
				});
			});
		}

		for (let i = 0; i < this._commentsButtons.length; i++) {
			this._commentsButtons[i].addEventListener('click', () => {
				if (postsStore$1.comments.get(postsStore$1.posts[i].id) === undefined || postsStore$1.comments.get(postsStore$1.posts[i].id).length === 0) {
					actionPost.getComments(postsStore$1.posts[i].id, this._commentBatchToLoad);
				} else {
					postsStore$1.comments.delete(postsStore$1.posts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");
					if (showMoreCommentButton.length !== 0) {
						this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
						postsStore$1.haveCommentsContinuation.delete(postsStore$1.posts[i].id);
					}
				}
			});
		}

		for (let i = 0; i < this._sendCommentButtons.length; ++i) {
			this._sendCommentButtons[i].addEventListener('click', () => {
				if (this._commentInput[i].value.trim() !== '') {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});

		}

		for (let i = 0; i < this._commentInput.length; ++i) {
			this._commentInput[i].addEventListener('keyup', (event) => {
				if (this._commentInput[i].value.trim() !== '' && event.code === 'Enter' && document.activeElement === this._commentInput[i]) {
					actionPost.createComment(postsStore$1.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			});
		}

		for (let i = 0; i < this._commentDeleteButton.length; ++i) {
			this._commentDeleteButton[i].addEventListener('click', () => {
				let commentID = this._commentDeleteButton[i].getAttribute('data-comment-id');
				actionPost.deleteComment(commentID);

				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				for (let j = 0; j < comments.length; ++j) {
					if (comments[j].id === Number(commentID)) {
						comments.splice(j, 1);
						break;
					}
				}
				postsStore$1.comments.set(postID, comments);

				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						postsStore$1.posts[i].comments_amount--;
					}
				}
				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditButton.length; ++i) {
			this._commentEditButton[i].addEventListener('click', () => {
				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);

				let commentID = Number(this._commentDeleteButton[i].getAttribute('data-comment-id'));

				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = true;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._commentEditSaveButton.length; ++i) {
			this._commentEditSaveButton[i].addEventListener('click', () => {
				let newCommentText = this._commentEditInput[i].value.trim();
				if (this._commentEditInput[i].value.trim() !== '') {
					let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));
					actionPost.editComment(commentID, newCommentText);

					let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
					let comments = postsStore$1.comments.get(postID);
					for (let i = 0; i < comments.length; ++i) {
						if (comments[i].id === commentID) {
							comments[i].editing_mode = false;
							comments[i].text = newCommentText;
						}
					}

				}
			});
		}

		for (let i = 0; i < this._commentEditCancelButton.length; ++i) {
			this._commentEditCancelButton[i].addEventListener('click', () => {
				let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));

				let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
				let comments = postsStore$1.comments.get(postID);
				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = false;
					}
				}

				this.updatePage();
			});
		}

		for (let i = 0; i < this._showMoreCommentsButton.length; ++i) {
			this._showMoreCommentsButton[i].addEventListener('click', () => {
				let postID = Number(this._showMoreCommentsButton[i].getAttribute('data-post-id'));

				console.log(postID);
				let lastCommentDate = postsStore$1.comments.get(postID).at(-1).raw_creation_date;
				console.log(lastCommentDate);


				for (let i = 0; i < postsStore$1.posts.length; ++i) {
					if (postsStore$1.posts[i].id === postID) {
						actionPost.getComments(postID, this._commentBatchToLoad, lastCommentDate);
						break;
					}
				}


				// this.updatePage();
			});
		}


		for (let i = 0; i < this._postsTexts.length; i++) {
			const text = this._postsTexts[i].textContent;
			if (text.split('\n').length > maxTextStrings || text.length > maxTextLength) {
				const post = this._postsTexts[i];
				let shortText;

				if (text.length > maxTextLength) {
					shortText = text.slice(0, maxTextLength) + '...';
				} else {
					const ind = text.indexOf('\n', text.indexOf('\n', text.indexOf('\n') + 1) + 1);
					shortText = text.slice(0, ind) + '...';
				}
				post.textContent = shortText;

				const openButton = document.createElement('div');
				openButton.textContent = 'Показать еще';
				openButton.style.color = '#9747FF';
				openButton.style.cursor = 'pointer';

				post.appendChild(openButton);
				openButton.addEventListener('click', function() {
					post.textContent = text;
				});
			}
		}

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				this.isEdit = this._editPosts[i].getAttribute("data-id");
				this.isCreate = false;
				postsStore$1.attachments = [];
				postsStore$1.addAttachments = [];
				postsStore$1.deleteAttachments = [];
				actionPost.getPostsById(this.isEdit, 1);
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', (e) => {
				e.stopPropagation();
				this.isCreate = true;
				this.isEdit = false;
				postsStore$1.attachments = [];
				postsStore$1.addAttachments = [];
				postsStore$1.deleteAttachments = [];
				super.render();
				this._text.focus();
			}, true);
		}

		if (this._addPhotoToPost) {
			this._addPhotoToPost.addEventListener('click', () => {
				this._createPosts.click();
				this._addPhotoToPostPic.click();
			});
		}

		if (this._editBtn) {
			this._editBtn.addEventListener('click', () => {
				actionPost.editPost(this._text.value, this.isEdit);
				this.isEdit = false;
			});
		}

		if (this._createBtn) {
			this._createBtn.addEventListener('click', () => {
				actionPost.createPostUser(userStore$1.user.user_link, userStore$1.userProfile.user_link, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				postsStore$1.attachments = [];
				postsStore$1.addAttachments = [];
				postsStore$1.deleteAttachments = [];
				super.render();
			});
		}

		if (this._addFriend) {
			this._addFriend.addEventListener('click', () => {
				const userId = this._addFriend.getAttribute("data-id");
				actionFriends.sub(userId);
			});
		}

		if (this._removeFriend) {
			this._removeFriend.addEventListener('click', () => {
				const userId = this._removeFriend.getAttribute("data-id");
				actionFriends.unsub(userId);
			});
		}

		if (this._addPhotoToPostPic) {
			this._addPhotoToPostPic.addEventListener('click', ()=> {
				if (postsStore$1.attachments === null) {
					postsStore$1.attachments = [];
				}
				if (postsStore$1.attachments.length >= 10) {
					return;
				}
				postsStore$1.text = this._text.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = function (e) {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore$1.attachments.length) {
								id = postsStore$1.attachments[postsStore$1.attachments.length-1].id + 1;
							}
							if (Router$1._getSearch(newUrl).type === 'img') {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'img'});
								postsStore$1.addAttachments.push(newUrl);
							} else {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
								postsStore$1.addAttachments.push(newUrl + `&filename=${file.name}`);
							}

							postsStore$1._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore$1.attachments.length; i++) {
					if (postsStore$1.attachments[i].id.toString() === imgId) {
						index = i;
						postsStore$1.deleteAttachments.push(Ajax$1.imgUrlBackConvert(postsStore$1.attachments[i].url));
						break;
					}
				}
				if (index > -1) {
					postsStore$1.attachments.splice(index, 1);
				}

				postsStore$1.text = this._text.value;
				postsStore$1._refreshStore();
			});
		}
	}

	showPage(search) {
		if (search.link) {
			this._userLink = search.link;
			actionUser.getProfile(() => { actionPost.getPostsByUser(this._userLink, 15); }, this._userLink);
		} else {
			actionUser.getProfile(() => { this._userLink = userStore$1.user.user_link; Router$1.go('/user?link=' + userStore$1.user.user_link, true); });
		}

		actionUser.getProfile();
		actionFriends.isFriend(search.link);
	}

	_preRender() {
		this._template = Handlebars.templates.profile;
		userStore$1.userProfile.isMyPage = true;
		if (this._userLink === userStore$1.user.user_link || this._userLink == null) {
			userStore$1.userProfile = userStore$1.user;
		} else {
			userStore$1.userProfile.isMyPage = false;
		}

		for (let i = 0; i < postsStore$1.posts.length; ++i) {
			postsStore$1.posts[i].comments = postsStore$1.comments.get(postsStore$1.posts[i].id);
			postsStore$1.posts[i].has_next = postsStore$1.haveCommentsContinuation.get(postsStore$1.posts[i].id);
		}

		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			profileData: userStore$1.userProfile,
			postAreaData: {
				createPostData:
				{
					displayNone: !(friendsStore$1.isMyFriend || userStore$1.userProfile.isMyPage),
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: userStore$1.user.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: userStore$1.user.avatar_url, attachments: postsStore$1.attachments, text: postsStore$1.text, buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, buttonData1: { text: 'Отменить', jsId: 'js-back-post-btn' },}
				},
				postList: postsStore$1.posts
			},
		};
		postsStore$1.text = '';

		this._context.profileData.isMyFriend = friendsStore$1.isMyFriend;

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore$1.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore$1.curPost.id;
			//this._context.postAreaData.createPostData.create.attachments = postsStore.curPost.attachments;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
}

class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'settingsGroup';

		this._groupLink = null;
		this._validateTitle = true;
		this._validateInfo = true;
		this._reader = new FileReader();

		this._fileList = null;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._dropArea = document.getElementById('js-drop-zone');
		this._dropContent = document.getElementById('js-drop-content');
		this._titleField = document.getElementById('js-title-input');
		this._titleErrorField = document.getElementById('js-title-error');
		this._infoField = document.getElementById('js-info-input');
		this._infoErrorField = document.getElementById('js-info-error');
		this._typeField = document.getElementById('js-type-input');
		this._showAuthorField = document.getElementById('js-showAuthor-input');
		this._saveBtn = document.getElementById('js-settings-save-btn');

		this._settingsBtn = document.getElementById('js-menu-main');
		this._settingsBtn.style.color = activeColor;
		this._subBtn = document.getElementById('js-menu-subscribers');
		this._requestsBtn = document.getElementById('js-menu-requests');

		this._deleteGroup = document.getElementById('js-group-delete-btn');

		this._error = document.getElementById('js-sign-in-error');
	}

	addPagesListener() {
		super.addPagesListener();

		this._dropArea.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		this._dropArea.addEventListener('drop', (event) => {
			event.preventDefault();

			this._fileList = event.dataTransfer.files[0];

			this._dropContent.innerHTML = '';
			this._reader.readAsDataURL(this._fileList);
			this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			});
		});

		this._saveBtn.addEventListener('click', () => {
			let privacy = null;
			if (this._typeField.value === 'Закрытая группа') {
				privacy = 'close';
			} else {
				privacy = 'open';
			}
			if (this._validateTitle && this._validateInfo) {
				this._error.textContent = '';
				this._error.classList.remove('display-inline-grid');
				this._error.classList.remove('font-color-error');
				this._error.classList.add('display-none');

				if (this._fileList) {
					actionImg.uploadImg(this._fileList, (newUrl) => {
						actionGroups.editGroup({link: this._groupLink, avatar: newUrl, title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._showAuthorField.checked});
					});
				} else {
					actionGroups.editGroup({link: this._groupLink, title: this._titleField.value, info: this._infoField.value, privacy: privacy, hideOwner: this._showAuthorField.checked});
				}
			} else {
				this._error.textContent = 'Заполните корректно все поля';
				this._error.classList.add('display-inline-grid');
				this._error.classList.add('font-color-error');
				this._error.classList.remove('font-color-ok');
				this._error.classList.remove('display-none');
			}
		});

		this._deleteGroup.addEventListener('click', () => {
			actionGroups.deleteGroup(this._groupLink);
			Router$1.go('/manageGroups', false);
		});

		this._titleField.addEventListener('change', () => {
			this._validateTitle = Validation$1.validation(this._titleField, this._titleErrorField, 'userStatus', 'settings');
		});

		this._infoField.addEventListener('change', () => {
			this._validateInfo = Validation$1.validation(this._infoField, this._infoErrorField, 'bio', 'settings');
		});
		
	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(null, this._groupLink); });
		} else {
			Router$1.goBack();
		}
	}

	_preRender() {
		this._template = Handlebars.templates.settingsGroup;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		let settings = settingsGroupConst;
		settings['avatar_url'] = groupsStore$1.curGroup.avatar_url;
		settings['inputInfo']['data'] = groupsStore$1.curGroup.title;
		settings['info'] = groupsStore$1.curGroup.info;
		if (groupsStore$1.curGroup.privacy === 'open') {
			settings['type'] = true;
		} else {
			settings['type'] = false;
		}
		settings['showAuthor'] = groupsStore$1.curGroup.hideOwner;

		if (groupsStore$1.editStatus && groupsStore$1.editMsg) {
			settings.errorInfo['errorText'] = groupsStore$1.editMsg;
			settings.errorInfo['errorClass'] = 'display-inline-grid font-color-ok';
		} else if (!groupsStore$1.editStatus && groupsStore$1.editMsg) {
			settings.errorInfo['errorText'] = groupsStore$1.editMsg;
			settings.errorInfo['errorClass'] = 'display-inline-grid font-color-error';
		} else {
			settings.errorInfo['errorText'] = '';
			settings.errorInfo['errorClass'] = 'display-none';
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settings,
		};
	}
}

class SettingsView extends BaseView {
	constructor() {
		super();

		this._jsId = 'settings';
		this.curPage = false;

		this._validateFirstName = true;
		this._validateLastName = true;
		this._validateStatus = true;
		this._validateBio = true;
		this._validateBirthday = true;

		this._reader = new FileReader();

		this._fileList = null;
	}

	addStore() {
		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._settingsBtn = document.getElementById('js-menu-main');
		this._safetyBtn = document.getElementById('js-menu-safety');
		this._settingsBtn.style.color = activeColor;

		this._dropZone = document.getElementById('js-drop-zone');
		this._dropContent = document.getElementById('js-drop-content');
		this._firstNameField = document.getElementById('js-first-name-input');
		this._firstNameErrorField = document.getElementById('js-first-name-error');
		this._lastNameField = document.getElementById('js-last-name-input');
		this._lastNameErrorField = document.getElementById('js-last-name-error');
		this._bioField = document.getElementById('js-bio-input');
		this._bioErrorField = document.getElementById('js-bio-error');
		this._birthdayField = document.getElementById('js-birthday-input');
		this._birthdayErrorField = document.getElementById('js-birthday-error');
		this._statusField = document.getElementById('js-status-input');
		this._statusErrorField = document.getElementById('js-status-error');
		this._saveBtn = document.getElementById('js-settings-save-btn');
		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._saveInfo = document.getElementById('js-save-info');
		this._dropArea = document.getElementById('js-drop-zone');

		this._error = document.getElementById('js-sign-in-error');
	}

	addPagesListener() {
		super.addPagesListener();

		this._safetyBtn.addEventListener('click', () => {
			Router$1.go('/safety', false);
		});

		this._dropArea.addEventListener('dragover', (event) => {
			event.preventDefault();
		});

		this._dropArea.addEventListener('drop', (event) => {
			event.preventDefault();

			this._fileList = event.dataTransfer.files[0];

			this._dropContent.innerHTML = '';
			this._reader.readAsDataURL(this._fileList);
			this._reader.addEventListener('load', (event) => {
				this._dropContent.src = event.target.result;
			});
		});

		this._saveBtn.addEventListener('click', () => {
			if (this._validateFirstName && this._validateLastName && this._validateStatus && this._validateBio && this._validateBirthday) {
				this._error.textContent = '';
				this._error.classList.remove('display-inline-grid');
				this._error.classList.remove('font-color-error');
				this._error.classList.add('display-none');

				let birthday;
				if (this._birthdayField.value) {
					birthday = new Date(this._birthdayField.value).toISOString();
				}
				if (this._fileList) {
					actionImg.uploadImg(this._fileList, (newUrl) => {
						actionUser.editProfile({avatar_url: newUrl, firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value, birthday: birthday, status: this._statusField.value});
					});
				} else {
					console.log();
					actionUser.editProfile({firstName: this._firstNameField.value, lastName: this._lastNameField.value, bio: this._bioField.value,  birthday: birthday, status: this._statusField.value});
				}
			} else {
				this._error.textContent = 'Заполните корректно все поля';
				this._error.classList.add('display-inline-grid');
				this._error.classList.add('font-color-error');
				this._error.classList.remove('font-color-ok');
				this._error.classList.remove('display-none');
			}
		});

		this._firstNameField.addEventListener('change', () => {
			this._validateFirstName = Validation$1.validation(this._firstNameField, this._firstNameErrorField, 'firstName', 'settings');
		});
		this._lastNameField.addEventListener('change', () => {
			this._validateLastName = Validation$1.validation(this._lastNameField, this._lastNameErrorField, 'lastName', 'settings');
		});
		this._statusField.addEventListener('change', () => {
			this._validateStatus = Validation$1.validation(this._statusField, this._statusErrorField, 'userStatus', 'settings');
		});
		this._bioField.addEventListener('change', () => {
			this._validateBio = Validation$1.validation(this._bioField, this._bioErrorField, 'bio', 'settings');
		});
		this._birthdayField.addEventListener('change', () => {
			this._validateBirthday = Validation$1.validation(this._birthdayField, this._birthdayErrorField, 'birthday', 'settings');
		});
	}

	showPage() {
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.settings;

		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		let settings = settingsConst;
		settings['avatar_url'] = userStore$1.user.avatar_url;
		settings['inputFields'][0]['data'] = userStore$1.user.firstName;
		settings['inputFields'][1]['data'] = userStore$1.user.lastName;
		settings['inputFields'][2]['data'] = userStore$1.user.bio;
		if (userStore$1.user.birthday) {
			settings['inputFields'][3]['data'] = userStore$1.user.birthday.substr(0, 10);
		} else {
			settings['inputFields'][3]['data'] = 'Дата не указана';
		}
		settings['inputFields'][4]['data'] = userStore$1.user.status;

		if (userStore$1.editStatus && userStore$1.editMsg) {
			settingsConst.errorInfo['errorText'] = userStore$1.editMsg;
			settingsConst.errorInfo['errorClass'] = 'display-inline-grid font-color-ok';
		} else if (!userStore$1.editStatus && userStore$1.editMsg) {
			settingsConst.errorInfo['errorText'] = userStore$1.editMsg;
			settingsConst.errorInfo['errorClass'] = 'display-inline-grid font-color-error';
		} else {
			settingsConst.errorInfo['errorText'] = '';
			settingsConst.errorInfo['errorClass'] = 'display-none';
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			settingsPathData: settingsConst,
		};
	}
}

class SafetyView extends BaseView {
	constructor() {
		super();
		this._addHandlebarsPartial();

		this._jsId = 'safety';
		this.curPage = false;

		this._validatePassword = true;
		this._validatePasswordNew = false;
        this._validatePasswordRepeat = true;

		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
		Handlebars.registerPartial('button', Handlebars.templates.button);
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
	}

	_addPagesElements() {
		super.addPagesElements();
		this._exitBtn = document.getElementById('js-exit-btn');
		this._settingsBtn = document.getElementById('js-settings-btn');
		this._settingsBtn = document.getElementById('js-menu-main');
		this._safetyBtn = document.getElementById('js-menu-safety');
		this._safetyBtn.style.color = activeColor;
		this._feedBtn = document.getElementById('js-logo-go-feed');

		this._passwordField = document.getElementById('js-password-input');
        this._passwordErrorField = document.getElementById('js-password-error');
		this._passwordNewField = document.getElementById('js-new-password-input');
        this._passwordNewErrorField = document.getElementById('js-new-password-error');
        this._passwordRepeatField = document.getElementById('js-repeat-password-input');
        this._passwordRepeatErrorField = document.getElementById('js-repeat-password-error');
		this._saveBtn = document.getElementById('js-change-password-btn');
		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
		this._saveInfo = document.getElementById('js-save-password-info');
	}

	_addPagesListener() {
		super.addPagesListener();
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		});

		this._groupsItem.addEventListener('click', () => {
            Router$1.go('/groups', false);
        });

		this._settingsBtn.addEventListener('click', () => {
            Router$1.go('/settings', false);
        });

		this._safetyBtn.addEventListener('click', () => {
            Router$1.go('/safety', false);
        });

		this._friendsItem.addEventListener('click', () => {
			Router$1.go('/friends', false);
		});

		this._msgItem.addEventListener('click', () => {
			Router$1.go('/message', false);
		});

		this._myPageItem.addEventListener('click', () => {
			Router$1.go('/user', false);
		});

		this._newsItem.addEventListener('click', () => {
			Router$1.go('/feed', false);
		});

		this._feedBtn.addEventListener('click', () => {
            Router$1.go('/feed', false);
        });

		this._saveBtn.addEventListener('click', () => {
			if (this._validatePassword && this._validatePasswordNew && this._validatePasswordRepeat) {
                actionUser.editProfile({password: this._passwordNewField.value});
				this._saveInfo.textContent = 'Изменения сохранены';
			}
		});

		this._passwordField.addEventListener('change', () => {
			//todo: проверить, что ввели верный пароль действующий
        });

		this._passwordNewField.addEventListener('change', () => {
            this._validatePasswordNew = Validation$1.validation(this._passwordNewField, this._passwordNewErrorField, 'password', 'settings');
        });

        this._passwordRepeatField.addEventListener('change', () => {
            //this._validatePasswordRepeat = Validation.validation(this._passwordRepeatField, this._passwordRepeatErrorField, 'secondPassword', 'settings');
        });
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore$1.user.isAuth) {
				Router$1.go('/signIn');
			} else {
				this._render();
			}
		}
	}

	showPage() {
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.safety;

		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			safetyPathData: safetyConst,
		};
	}

	_render() {
		this._preRender();
		Router$1.rootElement.innerHTML = this._template(this._context);
		this._addPagesElements();
		this._addPagesListener();
	}

}

class MessagesView extends BaseView {
	constructor() {
		super();

		this._jsId = 'messages';
		this.curPage = false;
	}

	addStore() {
		messagesStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._msgItem.style.color = activeColor;

		this._groupsItem = document.getElementById('js-side-bar-groups');

		this._goToMsg = document.getElementsByClassName('js-go-chat');
	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._goToMsg.length; i++) {
			this._goToMsg[i].addEventListener('click', () => {
				const chatId = this._goToMsg[i].getAttribute("data-id");
				localStorage.setItem('chatId', chatId);
				actionMessage.getChatsMsg(chatId,15);
				Router$1.go('/chat', false);
			});
		}
	}

	showPage() {
		actionUser.getProfile(() => { actionMessage.getChats(15); });
	}

	_preRender() {
		this._template = Handlebars.templates.messages;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;
		console.log(messagesStore$1.chats);
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			textInfo: {
				textInfo: 'У вас пока нет чатов',
			},
			messagesData: messagesStore$1.chats,
		};
		console.log(this._context);
	}
}

class ChatView extends BaseView {
	constructor() {
		super();
		this._jsId = 'chat';
		this._curMsg = '';
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		messagesStore$1.registerCallback(this.updatePage.bind(this));
		userStore$1.registerCallback(this.updatePage.bind(this));
		postsStore$1.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._backBtn = document.getElementById('js-back-to-messages-btn');
		this._sendMsg = document.getElementById('js-send-msg');
		this._sendMsgBlock = document.getElementById('js-send-msg-block');
		this._msg = document.getElementById('js-msg-input');

		this._msg.focus();

		this._f = document.getElementById('js-1');
		this._f.scrollTop = this._f.scrollHeight;

		let textarea = document.getElementsByTagName('textarea');

		textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;overflow-y:hidden;');
		textarea[0].addEventListener("input", OnInput, false);

		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		this._addPhotoToMsg = document.getElementById('js-add-photo-to-msg');
		this._removeImg = document.getElementsByClassName('js-delete-photo-from-msg');
	}

	addPagesListener() {
		super.addPagesListener();

		this._backBtn.addEventListener('click', () => {
			postsStore$1.attachments = [];
			Router$1.goBack();
		});

		this._sendMsg.addEventListener('click', () => {
			if (this._msg.value.length) {
				localStorage.setItem('curMsg', '');
				if (postsStore$1.attachments.length) {
					let sendAttachments = [];
					postsStore$1.attachments.forEach((img) => {
						if (img.type === 'file') {
							sendAttachments.push(Ajax$1.imgUrlBackConvert(img.url) + `&filename=${img.filename}`);
						} else {
							sendAttachments.push(Ajax$1.imgUrlBackConvert(img.url));
						}
					});
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value, sendAttachments);
				} else {
					actionMessage.msgSend(localStorage.getItem('chatId'), this._msg.value);
				}
				this._msg.value = '';
			}
		});

		this._msg.addEventListener('input', (event) => {
			if (event.target.value.length) {
				this._sendMsg.classList.remove('display-none');
				this._sendMsgBlock.classList.add('display-none');
			} else {
				this._sendMsg.classList.add('display-none');
				this._sendMsgBlock.classList.remove('display-none');
			}
		});

		this._msg.addEventListener("keydown", function(event) {
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				document.getElementById("js-send-msg").click();
			}
		});

		if (this._addPhotoToMsg) {
			this._addPhotoToMsg.addEventListener('click', ()=> {
				console.log(postsStore$1.attachments);
				if (postsStore$1.attachments === null) {
					postsStore$1.attachments = [];
				}
				if (postsStore$1.attachments.length >= 10) {
					return;
				}
				postsStore$1.text = this._msg.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = () => {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore$1.attachments.length) {
								id = postsStore$1.attachments[postsStore$1.attachments.length-1].id + 1;
							}
							if (Router$1._getSearch(newUrl).type === 'img') {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'img'});
							} else {
								postsStore$1.attachments.push({url: Ajax$1.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
							}

							postsStore$1._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore$1.attachments.length; i++) {
					if (postsStore$1.attachments[i].id.toString() === imgId) {
						index = i;
						break;
					}
				}
				if (index > -1) {
					postsStore$1.attachments.splice(index, 1);
				}

				postsStore$1.text = this._msg.value;
				postsStore$1._refreshStore();
			});
		}
	}

	showPage() {
		const chatId = localStorage.getItem('chatId');
		postsStore$1.attachments = [];
		if (chatId) {
			actionUser.getProfile(() => { actionMessage.getChatsMsg(chatId,50); actionMessage.getChats(15); });
		} else {
			Router$1.goBack();
		}
	}

	_preRender() {
		alert(postsStore$1.attachments.length);
		let curChat = null;
		messagesStore$1.chats.forEach((chat) => {
			if (String(chat.chat_id) === localStorage.getItem('chatId')) {
				curChat = chat;
			}
		});

		let secondUser = null;
		if (curChat) {
			secondUser = curChat.members[0];

			if (curChat.members[0].user_link === userStore$1.user.user_link && curChat.members.length !== 1) {
				secondUser = curChat.members[1];
			}

		}

		this._template = Handlebars.templates.chatPage;
		let header = headerConst;
		header['avatar_url'] = userStore$1.user.avatar_url;

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			chatData: {messages: messagesStore$1.messages, attachments: postsStore$1.attachments, user: secondUser, chat: curChat, curMsg: localStorage.getItem('curMsg')},
		};
	}
}

class NotFoundView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'not-found';
		this.curPage = false;
	}

	_addHandlebarsPartial() {
        Handlebars.registerPartial('notFound', Handlebars.templates.notFound);
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		this._render();
	}

	_preRender() {
		this._context = {
			code: '404',
			text: 'Страница не найдена',
		};
	}

	_render() {
		this._preRender();
		this._template = Handlebars.templates.notFound;
		Router$1.rootElement.innerHTML = this._template(this._context);
	}
}

class imgStore {
    constructor() {
        this._callbacks = [];

        Dispatcher$1.register(this._fromDispatch.bind(this));
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
            case 'uploadImg':
                await this._uploadImg(action.data, action.callback, action.filename);
                break;
            default:
                return;
        }
    }

    async _uploadImg(data, callback, filename) {
        const request = await Ajax$1.uploadImg(data, filename);
        const response = await request.json();

        if (request.status === 200) {
            const newUrl = `static-service/download?name=${ response.body.form[0].name }&type=${ response.body.form[0].type }`;
            callback(newUrl);
        } else {
            alert('uploadImg error');
        }
    }
}

new imgStore();

const Views = {
    FeedView: new FeedView(),
    SignInView: new SignInView(),
    SignUpView: new SignUpView(),
    FriendsView: new FriendsView(),
    GroupsView: new GroupsView(),
    GroupView: new GroupView$1(),
    ProfileView: new ProfileView(),
    SettingsGroupView: new GroupView(),
    SettingsView: new SettingsView(),
    SafetyView: new SafetyView(),
    MessagesView: new MessagesView(),
    ChatView: new ChatView(),
    NotFoundView: new NotFoundView(),
};

Router$1.registerPage('/', Views.FeedView);
Router$1.registerPage('/feed', Views.FeedView);
Router$1.registerPage('/signIn', Views.SignInView);
Router$1.registerPage('/signUp', Views.SignUpView);
Router$1.registerPage('/friends', Views.FriendsView);
Router$1.registerPage('/groups', Views.GroupsView);
Router$1.registerPage('/subscribers', Views.FriendsView);
Router$1.registerPage('/subscriptions', Views.FriendsView);
Router$1.registerPage('/findFriends', Views.FriendsView);
Router$1.registerPage('/group', Views.GroupView);
Router$1.registerPage('/groups', Views.GroupsView);
Router$1.registerPage('/manageGroups', Views.GroupsView);
Router$1.registerPage('/findGroups', Views.GroupsView);
Router$1.registerPage('/popularGroups', Views.GroupsView);
Router$1.registerPage('/myPage', Views.ProfileView);
Router$1.registerPage('/user', Views.ProfileView);
Router$1.registerPage('/settingsGroup', Views.SettingsGroupView);
Router$1.registerPage('/settings', Views.SettingsView);
Router$1.registerPage('/safety', Views.SafetyView);
Router$1.registerPage('/message', Views.MessagesView);
Router$1.registerPage('/chat', Views.ChatView);
Router$1.registerPage('/404', Views.NotFoundView);

actionUser.checkAuth(() => { Router$1.init(); });
