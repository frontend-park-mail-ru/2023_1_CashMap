import Router from "../modules/router.js";
import {actionUser} from "../actions/actionUser.js";
import userStore from "../stores/userStore.js";


/**
 * Базовый класс View
 */
export default class BaseView {
    /**
     * Конструктор базового класса view. Содержит подключение компонентов Handlebars,
     * и информацию о странице отрисовки.
     */
    constructor() {
        this.addHandlebarsPartial();
        this.addStore();

        this.curPage = false;
    }

    /**
     * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
     */
    addStore() {

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
        Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
        Handlebars.registerPartial('signIn', Handlebars.templates.signIn);
        Handlebars.registerPartial('signUp', Handlebars.templates.signUp);
        Handlebars.registerPartial('signInPath', Handlebars.templates.signInPath);
        Handlebars.registerPartial('signUpPath', Handlebars.templates.signUpPath);
    }

    /**
     * @private метод, добавляющий на страницу базовые элементы.
     */
    addPagesElements() {
        this._exitBtn = document.getElementById('js-exit-btn');
        this._settingsBtn = document.getElementById('js-settings-btn');

        this._myPageItem = document.getElementById('js-side-bar-my-page');
        this._newsItem = document.getElementById('js-side-bar-news');
        this._msgItem = document.getElementById('js-side-bar-msg');
        this._photoItem = document.getElementById('js-side-bar-photo');
        this._friendsItem = document.getElementById('js-side-bar-friends');
        this._groupsItem = document.getElementById('js-side-bar-groups');
        this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
    }

    /**
     * @private метод, добавляющий на страницу события базовых элементов.
     */
    addPagesListener() {
        this._exitBtn.addEventListener('click', () => {
            actionUser.signOut();
        });

        this._settingsBtn.addEventListener('click', () => {
            Router.go('/settings', false);
        });

        this._myPageItem.addEventListener('click', () => {
            Router.go('/myPage', false);
        });

        this._msgItem.addEventListener('click', () => {
            Router.go('/message', false);
        });

        this._newsItem.addEventListener('click', () => {
            Router.go('/feed', false);
        });

        this._friendsItem.addEventListener('click', () => {
            Router.go('/friends', false);
        });
    }

    /**
     * Метод, удаляющий текущую страницу.
     */
    remove() {
        document.getElementById(this._jsId)?.remove();
    }

    /**
     * Метод, вызываемый callback при изменении store, от которых он зависит.
     */
    updatePage() {
        if (this.curPage) {
            if (!userStore.user.isAuth) {
                Router.go('/signIn');
            } else {
                this.render();
            }
        }
    }

    /**
     * @private метод, задающий контекст отрисовки конкретной вьюхи.
     */
    _preRender() {

    }

    /**
     * @private метод отрисовки страницы.
     */
    render() {
        this._preRender();
        Router.rootElement.innerHTML = this._template(this._context);
        this.addPagesElements();
        this.addPagesListener();
    }
}
