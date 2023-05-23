import Dispatcher from '../dispatcher/dispatcher.js';
import Ajax from "../modules/ajax.js";
import {actionUser} from "../actions/actionUser.js";
import {groupAvatarDefault, headerConst} from "../static/htmlConst.js";
import {actionGroups} from "../actions/actionGroups.js";

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

        this.hasNextGroups = true;
        this.hasNextManagedGroups = true;
        this.hasNextGroups = true;
        this.hasNextFoundGroups = true;

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
            case 'getGroups':
                await this._getGroups(action.count, action.offset, action.isScroll);
                break;
            case 'getManageGroups':
                await this._getManageGroups(action.count, action.offset, action.isScroll);
                break;
            case 'getNotGroups':
                await this._getNotGroups(action.count, action.offset, action.isScroll);
                break;
            case 'getPopularGroups':
                await this._getPopularGroups(action.count, action.offset, action.isScroll);
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
    async _getGroups(count, offset, isScroll=false) {
        const request = await Ajax.getGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.groups && response.body.groups.length !== 0) {
                this.hasNextGroups = true;
                response.body.groups.forEach((group) => {
                    group.isGroup = true;
                    if (!group.avatar_url) {
                        group.avatar_url = groupAvatarDefault;
                    } else {
                        group.avatar_url = Ajax.imgUrlConvert(group.avatar_url);
                    }
                    if (group.privacy === 'open') {
                        group.privacy = 'Открытая группа';
                    } else {
                        group.privacy = 'Закрытая группа';
                    }
                });
            } else {
                this.hasNextGroups = false;
            }


            if (isScroll) {
                this.groups.push(...response.body.groups);
            } else {
                this.groups = response.body.groups;
            }
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
    async _getManageGroups(count, offset, isScroll=false) {
        const request = await Ajax.getmanageGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.groups && response.body.groups.length !== 0) {
                this.hasNextManagedGroups = true;
                response.body.groups.forEach((group) => {
                    group.isUserGroup = true;
                    if (!group.avatar_url) {
                        group.avatar_url = groupAvatarDefault;
                    } else {
                        group.avatar_url = Ajax.imgUrlConvert(group.avatar_url);
                    }
                    if (group.privacy === 'open') {
                        group.privacy = 'Открытая группа';
                    } else {
                        group.privacy = 'Закрытая группа';
                    }
                });
            } else {
                this.hasNextManagedGroups = false;
            }

            if (isScroll) {
                this.manageGroups.push(...response.body.groups);
            } else {
                this.manageGroups = response.body.groups;
            }
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
    async _getNotGroups(count, offset, isScroll=false) {
        const request = await Ajax.getNotGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            if (response.body.groups && response.body.groups.length !== 0) {
                this.hasNextFoundGroups = true;
                response.body.groups.forEach((group) => {
                    group.isNotUserGroup = true;
                    if (!group.avatar_url) {
                        group.avatar_url = groupAvatarDefault;
                    } else {
                        group.avatar_url = Ajax.imgUrlConvert(group.avatar_url);
                    }
                    if (group.privacy === 'open') {
                        group.privacy = 'Открытая группа';
                    } else {
                        group.privacy = 'Закрытая группа';
                    }
                });
            } else {
                this.hasNextFoundGroups = false;
            }

            if (isScroll) {
                this.findGroups.push(...response.body.groups);
            } else {
                this.findGroups = response.body.groups;
            }
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
    async _getPopularGroups(count, offset, isScroll=false) {
        const request = await Ajax.getPopularGroups(count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.groups.forEach((group) => {
                group.isPopularGroup = true;
                if (!group.avatar_url) {
                    group.avatar_url = groupAvatarDefault;
                } else {
                    group.avatar_url = Ajax.imgUrlConvert(group.avatar_url);
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
        const request = await Ajax.getGroupInfo(link);
        const response = await request.json();

        if (request.status === 200) {
            this.curGroup = response.body.group_info;
            this.curGroup.isSub = response.body.is_sub;
            this.curGroup.isAdmin = response.body.is_admin;

            if (!this.curGroup.avatar_url) {
                this.curGroup.avatar_url = groupAvatarDefault;
            } else {
                this.curGroup.avatar_url = Ajax.imgUrlConvert(this.curGroup.avatar_url);
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
        const request = await Ajax.getGroupsSub(link, count, offset);
        const response = await request.json();

        if (request.status === 200) {
            response.body.profiles.forEach((user) => {
                if (!user.avatar_url) {
                    user.avatar_url = headerConst.avatarDefault;
                } else {
                    user.avatar_url = Ajax.imgUrlConvert(user.avatar_url);
                }
            })
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
        const request = await Ajax.createGroup(data.title, data.info, data.privacy, data.hideOwner);

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
        const request = await Ajax.editGroup(data.link, data.title, data.info, data.avatar, data.privacy, data.hideOwner);
        if (request.status === 200) {

            if (data.avatar) {
                this.curGroup.avatar_url = this.curGroup.avatar_url = Ajax.imgUrlConvert(data.avatar);
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
        const request = await Ajax.deleteGroup(link);
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
        const request = await Ajax.groupSub(link);
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
        const request = await Ajax.groupUnsub(link);
        if (request.status === 200) {
            this.curGroup.isSub = false;
            actionGroups.getGroups(15, 0);
        } else if (request.status === 401) {
            actionUser.signOut();
        } else {
            alert('groupUnsub error');
        }

        this._refreshStore();
    }
}

export default new groupsStore();
