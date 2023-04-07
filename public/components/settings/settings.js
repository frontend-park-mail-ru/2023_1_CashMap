export default class Settings {

	#config
	#parent

	constructor(parent) {
		this.#parent = parent;

		this.#config = {
			sideBarData: {
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
			},
			headerData: {
				profileUrl: '#',
				avatar: 'static/img/post_icons/profile_image.svg',
				exitButton: { text: 'Выход', jsId: 'js-exit-btn', iconPath: 'static/img/exit.svg', hoveredIconPath: 'static/img/exit_hover.svg'},
				settingsButton: { text: 'Настройки', jsId: 'js-settings-btn', iconPath: 'static/img/settings.svg', hoveredIconPath: 'static/img/settings_hover.svg'},
			},
			settingsPathData: {
                avatar: "static/img/post_icons/profile_image.svg",
                inputFields:
                    [
                    { help: 'Имя',
                      type: 'text',
                      jsIdInput: 'js-first-name-input',
                      jsIdError: 'js-first-name-error'},
                    { help: 'Фамилия',
                      type: 'text',
                      jsIdInput: 'js-last-name-input',
                      jsIdError: 'js-last-name-error'},
                    { help: 'Электронная почта',
                      type: 'email',
                      jsIdInput: 'js-email-input',
                      jsIdError: 'js-email-error'},
                    { help: 'Город',
                      type: 'text',
                      jsIdInput: 'js-city-input',
                      jsIdError: 'js-city-error'},
                    { help: 'Дата рождения',
                      type: 'date',
                      jsIdInput: 'js-birthday-input',
                      jsIdError: 'js-birthday-error'},
                    { help: 'Статус',
                      type: 'text',
                      jsIdInput: 'js-status-input',
                      jsIdError: 'js-status-error'}
                    ],
                buttonInfo: { text: 'Сохранить',
                    jsId: 'js-settings-save-btn'},
			},
		};
	}
    
    render() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)

		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('settingsPath', Handlebars.templates.settingsPath)

		const template = Handlebars.templates.settings;
		this.#parent.innerHTML = template(this.#config);
	}
}
