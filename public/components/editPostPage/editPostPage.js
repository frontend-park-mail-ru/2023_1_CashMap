export default class EditPostPage {

	#config
	#parent

	constructor(parent, posts) {
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
			editPostData: {
				avatar: 'static/img/post_icons/profile_image.svg',
				//text: '',
				text: 'Это мой пост ьсчмльв ылчмь оват чсомтоватчсомтыовутчмот авочс мсфытвчст аипавывтаимтвостст чяотмсовчтос счотм сотм ',
				buttonData: {
					text: 'Опубликовать',
					jsId: 'js-edit-post-btn'
				}
			},
		};
	}

	render() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('buttonDefault', Handlebars.templates.buttonDefault)

		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('editPost', Handlebars.templates.editPost)

		const template = Handlebars.templates.editPostPage;
		this.#parent.innerHTML = template(this.#config);
	}

}
