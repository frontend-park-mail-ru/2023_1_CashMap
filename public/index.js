import { SideBar } from './components/sidebar/sidebar.js';


const main = document.getElementsByClassName('main')[0];
renderSideBar();











function renderSideBar(parent) {
	navItems = {
				{
					ref: '/profile',
					iconPath: '../html/img/nav-icons/profile.svg',
					hoveredIconPath: '../html/img/nav-icons/profile_hover.svg',
					title: 'Моя страница',
					notifies: 0
				},

				{
					ref: '/feed',
					iconPath: '../html/img/nav-icons/news.svg',
					hoveredIconPath: '../html/img/nav-icons/news_hover.svg',
					title: 'Новости',
					notifies: 0
				},

				{
					ref: '/msg',
					iconPath: '../html/img/nav-icons/messenger.svg'
					hoveredIconPath: '../html/img/nav-icons/messenger_hover.svg',
					title: 'Мессенджер',
					notifies: 0
				},

				{
					ref: '/albums',
					iconPath: '../html/img/nav-icons/photos.svg',
					hoveredIconPath: '../html/img/nav-icons/photos_hover.svg',
					title: 'Фотографии',
					notifies: 0
				},

				{
					ref: '/friends',
					iconPath: '../html/img/nav-icons/friends.svg'
					hoveredIconPath: '../html/img/nav-icons/friends_hover.svg',
					title: 'Друзья',
					notifies: 0
				},

				{
					ref: '/groups',
					iconPath: '../html/img/nav-icons/groups.svg',
					hoveredIconPath: '../html/img/nav-icons/groups_hover.svg'
					title: 'Сообщества',
					notifies: 0
				},

				{
					ref: '/bookmarks',
					iconPath: '../html/img/nav-icons/bookmarks',
					hoveredIconPath: '../html/img/nav-icons/bookmarks_hover',
					title: 'Закладки',
					notifies: 0
				}
			};

	const sideBar = new SideBar(parent, 'Depeche', 'html/img/logo.svg', navItems);

	sideBar.render();
} 


