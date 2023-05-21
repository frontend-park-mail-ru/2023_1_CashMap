import Router from "../modules/router.js";
import {actionUser} from "../actions/actionUser.js";
import userStore from "../stores/userStore.js";
import {actionSearch} from "../actions/actionSearch.js";
import searchStore from "../stores/dropdownSearchStore.js";
import friendSearchStore from "../stores/dropdownFriendsSearchStore.js";
import {searchDropdownConst} from "../static/htmlConst.js";
import {actionMessage} from "../actions/actionMessage.js";
import dropdownFriendsSearchStore from "../stores/dropdownFriendsSearchStore.js";
import {actionGroups} from "../actions/actionGroups.js";

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
        this.timerId = null;

        this.interval = null;
    }

    /**
     * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addStore() {
        searchStore.registerCallback(this._updateDropdownSearchList.bind(this));
        friendSearchStore.registerCallback(this._initDropdownSearchList.bind(this));
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
            Router.go('/settings', false);
        });

        this._groupsItem.addEventListener('click', () => {
            Router.go('/groups', false);
        });
 
        this._feedBtn.addEventListener('click', () => {
            Router.go('/feed', false);
        });

        this._myPageItem.addEventListener('click', () => {
            Router.go('/user', false);
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
            })
        });

        this._searchAreaInput.addEventListener('click', () => {
            this._searchDropdown.style.display = 'grid';
            // почему-то летит 6 запросов по одному кликую........
            if (this._searchAreaInput.value.trim() === "") {
                if (userStore.user.user_link === null) {
                    actionUser.getProfile(() => {
                        actionSearch.friendSearchForDropdown(userStore.user.user_link, 3, 0);
                    })
                } else {
                    actionSearch.friendSearchForDropdown(userStore.user.user_link, 3, 0);
                }
            } else {
                actionSearch.searchForDropdown(this._searchAreaInput.value);
            }
        });

        for (let i = 0; i < this._goToProfile.length; i++) {
            this._goToProfile[i].addEventListener('click', () => {
                const userId = this._goToProfile[i].getAttribute("data-id");
                Router.go('/user?link=' + userId, false);
            });
        }

        for (let i = 0; i < this._goToGroup.length; i++) {
            this._goToGroup[i].addEventListener('click', () => {
                const groupId = this._goToGroup[i].getAttribute("data-id");
                Router.go('/group?link=' + groupId, false);
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
                Router.go('/findFriends');
            });
        }

        if (this._showMoreCommunititesButton !== null) {
            this._showMoreCommunititesButton.addEventListener('mousedown', () => {
                localStorage.setItem("searchQuery", this._searchAreaInput.value);
                Router.go('/findGroups');
            });
        }

        for (let i = 0; i < this._group_search_items.length; i++) {
            this._group_search_items[i].addEventListener('mousedown', () => {
                const groupLink = this._group_search_items[i].getAttribute("data-group-link");
                Router.go('/group?link=' + groupLink);
            });
        }

        for (let i = 0; i < this._userSearchItems.length; i++) {
            this._userSearchItems[i].addEventListener('mousedown', () => {
                const userLink = this._userSearchItems[i].getAttribute("data-user-link");
                Router.go('/user?link=' + userLink);
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
            if (!userStore.user.isAuth) {
                Router.go('/signIn');
            } else {
                this.render();
            }
        }
    }

    subscribe(groupLink) {
        actionGroups.groupSub(groupLink)
    }

    startMessaging(userId) {
        actionMessage.chatCheck(userId, () => {
            if (localStorage.getItem('chatFriendId')) {
                localStorage.setItem('chatId', localStorage.getItem('chatFriendId'));
                Router.go('/chat', false);
                actionMessage.getChatsMsg(localStorage.getItem('chatId'),15);
            } else {
                actionMessage.chatCreate(userId, () => {
                    if (localStorage.getItem('chatId')) {
                        Router.go('/chat', false);
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

    startIntervalTask(time, callback) {
        this.interval = window.setInterval(callback, time);
    }

    interruptIntervalTask() {
        clearInterval(this.interval);
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
        Router.rootElement.innerHTML = this._template(this._context);
        this.addPagesElements();
        this.addPagesListener();
    }
}


