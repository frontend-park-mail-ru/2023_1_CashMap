import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";

class postsStore {
    constructor() {
        this._callbacks = [];

        this.posts = {
            postList: [],
        };
        this.sideBarData = {
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
        this.headerData = {
            profileUrl: '#',
            avatar: 'static/img/post_icons/profile_image.svg',
            exitButton: { text: 'Выход', jsId: 'js-exit-btn', iconPath: 'static/img/exit.svg', hoveredIconPath: 'static/img/exit_hover.svg'},
            settingsButton: { text: 'Настройки', jsId: 'js-settings-btn', iconPath: 'static/img/settings.svg', hoveredIconPath: 'static/img/settings_hover.svg'},
        };

        Dispatcher.register(this.invokeOnDispatch.bind(this));
    }

    registerCallback(callback) {
        this._callbacks.push(callback);
    }

    async invokeOnDispatch(payload) {
        await this._fromDispatch(payload);
    }

    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'getPosts':
                await this._getPosts(action.data);
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

    async _getPosts(data) {
        const request = await Ajax.getPosts(10);

        if (request.status === 200) {
            this.user.isAuth = true;
            console.log(request.data);

            this.

            this._callbacks.forEach((callback) => {
                if (callback) {
                    callback();
                }
            });
        }
    }

    async _createPost(data) {

    }

    async _deletePost() {

    }

    async _editPost() {

    }

}

export default new postsStore();
