export default class Messages {

	#config
	#parent

	constructor(parent) {
		this.#parent = parent;


		this.#config = {
			sideBarData: {
				logoImgPath: 'static/img/logo.svg',
				logoText: 'Depeche',
				menuItemList: [
					{text: 'Моя страница', jsId: 'js-side-bar-my-page', iconPath: 'static/img/nav_icons/profile.svg', notifies: 1},
					{text: 'Новости', jsId: 'js-side-bar-news', iconPath: 'static/img/nav_icons/news.svg', notifies: 0},
					{text: 'Мессенджер', jsId: 'js-side-bar-msg', iconPath: 'static/img/nav_icons/messenger.svg', notifies: 7},
					{text: 'Фотографии', jsId: 'js-side-bar-photo', iconPath: 'static/img/nav_icons/photos.svg', notifies: 0},
					{text: 'Друзья', jsId: 'js-side-bar-friends', iconPath: 'static/img/nav_icons/friends.svg', notifies: 0},
					{text: 'Сообщества', jsId: 'js-side-bar-groups', iconPath: 'static/img/nav_icons/groups.svg', notifies: 0},
					{text: 'Закладки', jsId: 'js-side-bar-bookmarks', iconPath: 'static/img/nav_icons/bookmarks.svg', notifies: 11}]
			},
			headerData: {
				profileUrl: '#',
				avatar: 'static/img/post_icons/profile_image.svg',
			},
			messagesData: [{
				id: 1,
				friendPhoto: 'static/img/post_icons/profile_image.svg',
				firstName: 'Карина',
				lastName: 'Анохина',
				text: 'Привет, как дела?',
				date: 'Вт',
				isMuted: false,
				isUnread: true
			},
			{
				id: 2,
				friendPhoto: 'static/img/post_icons/profile_image.svg',
				firstName: 'Федор',
				lastName: '<Базалеев>',
				text: 'Хорошо пишется диплом без темы!',
				date: 'Чт',
				isMuted: false,
				isUnread: false
			},
			{
				id: 3,
				friendPhoto: 'static/img/post_icons/profile_image.svg',
				firstName: 'Егор',
				lastName: 'Ларкин',
				text: 'Сегодня дела',
				date: '20.03.23',
				isMuted: true,
				isUnread: true
			},
			{
				id: 4,
				friendPhoto: 'static/img/post_icons/profile_image.svg',
				firstName: 'Павел',
				lastName: 'Репин',
				text: 'Привет, как дела?',
				date: '10.01.23',
				isMuted: false,
				isUnread: false
			}
		]
		};
	}

	render() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)

		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('search', Handlebars.templates.search)
		Handlebars.registerPartial('message', Handlebars.templates.message)

		const template = Handlebars.templates.messages;
		this.#parent.innerHTML = template(this.#config);
	}

}
