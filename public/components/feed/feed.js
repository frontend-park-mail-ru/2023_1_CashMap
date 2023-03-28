export default class Feed {

	#config
	#parent

	constructor(parent, posts) {
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
			postAreaData: {
				createPostData: { avatar: "static/img/post_icons/profile_image.svg" },
				postList: posts,
			},
		};
	}

	render() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)

		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('post', Handlebars.templates.post)
		Handlebars.registerPartial('createPost', Handlebars.templates.createPost)

		const template = Handlebars.templates.feed;
		this.#parent.innerHTML = template(this.#config);
	}

}
