export default class Profile {

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
			profileData: {
                id: 1,
				avatar: 'static/img/post_icons/profile_image.svg',
				firstName: 'Карина',
				lastName: 'Анохина',
				status: 'Это мой статус)))',
				birthday: '01.01.2000'
            },
			postAreaData: [
                {
                    senderName: "Pavel Repin",
                    senderPhoto: "static/img/post_icons/profile_image.svg",
                    date: "1 ноя 2019",
                    body: "lorem ipsum lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber commentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumberv",
                    likeNumber: 10,
                    commentsNumber: 4,
                    comments: [
                        {
                            senderName: "Карина Анохина",
                            senderPhotoPath: "static/img/nav_icons/profile.svg",
                            date: "1 ноя 2019",
                            body: "Увау, классно мыслишь!",
                        },
        
                        {
                            senderName: "Карина Анохина",
                            senderPhotoPath: "static/img/nav_icons/profile.svg",
                            date: "1 ноя 2019",
                            body: "Увау, классно мыслишь!",
                        }
                    ]
                },
        
                {
                    senderName: "Egor Larkin",
                    senderPhoto: "static/img/post_icons/profile_image.svg",
                    date: "1 ноя 2007",
                    body: "lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber",
                    likeNumber: 122,
                    commentsNumber: 400
                },
        
                {
                    senderName: "Egor Larkin",
                    senderPhoto: "static/img/post_icons/profile_image.svg",
                    date: "1 ноя 2007",
                    body: "lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber",
                    likeNumber: 122,
                    commentsNumber: 400
                },
        
                {
                    senderName: "Egor Larkin",
                    senderPhoto: "static/img/post_icons/profile_image.svg",
                    date: "1 ноя 2007",
                    body: "lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber",
                    likeNumber: 122,
                    commentsNumber: 400,
                    comments: [
                        {
                            senderName: "Карина Анохина",
                            senderPhotoPath: "static/img/nav_icons/profile.svg",
                            date: "1 ноя 2019",
                            body: "Увау, классно мыслишь!",
                        },
                    ]
                },
        
                {
                    senderName: "Egor Larkin",
                    senderPhoto: "static/img/post_icons/profile_image.svg",
                    date: "1 ноя 2007",
                    body: "lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber",
                    likeNumber: 122,
                    commentsNumber: 400
                },
            ]
		};
	}

	render() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)

		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('profileCard', Handlebars.templates.profileCard)
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea)

		const template = Handlebars.templates.profile;
		this.#parent.innerHTML = template(this.#config);
	}

}
