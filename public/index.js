import { SideBar } from './components/sidebar/sidebar.js';
import { Post } from './components/post/post.js';
import { Feed } from './components/feed/feed.js';
import Header from "./components/header/header.js";
import CreatePost from "./components/createPost/createPost.js";


const rootElement = document.getElementById('root');
const main = document.createElement('div');
main.classList.add('main');

const content = document.createElement('div');
content.classList.add('main-content');
main.appendChild(content);

const feed = document.createElement('div');
feed.classList.add('feed');
content.appendChild(feed);

rootElement.appendChild(main);

renderHeader(content)
renderCreatePost(content)

renderSideBar(main);

renderFeed(feed);


function renderFeed(parent) {
	const posts = [
		{
			senderName: "Pavel Repin",
			senderPhoto: "static/img/nav_icons/profile.svg",
			date: "1 ноя 2019",
			body: "lorem ipsum lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber commentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumberv",
			likeNumber: 10,
			commentsNumber: 4
		},

		{
			senderName: "Egor Larkin",
			senderPhoto: "static/img/nav_icons/profile.svg",
			date: "1 ноя 2007",
			body: "lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber",
			likeNumber: 122,
			commentsNumber: 400
		},
	]

	for (const post of posts) {
		renderPost(parent, post)
	}

}


function renderPost(parent, postData) {	
	const staticPaths = {
		postEditIconPath: "",
		likeIconPath: "",
		clickedLikeIconPath: "",
		commentIconPath: "",
		bookmarkIconPath: "",
		clickedBookmarkIconPath: ""
	}

	const post = new Post(parent, postData, staticPaths);
	post.render();
}



function renderSideBar(parent) {
	const navItems = {
		pages: [
				{
					ref: '/profile',
					iconPath: './static/img/nav_icons/profile.svg',
					hoveredIconPath: '../html/img/nav-icons/profile_hover.svg',
					title: 'Моя страница',
					notifies: 0
				},

				{
					ref: '/feed',
					iconPath: '../html/img/nav_icons/news.svg',
					hoveredIconPath: '../html/img/nav-icons/news_hover.svg',
					title: 'Новости',
					notifies: 0
				},

				{
					ref: '/msg',
					iconPath: '../html/img/nav_icons/messenger.svg',
					hoveredIconPath: '../html/img/nav-icons/messenger_hover.svg',
					title: 'Мессенджер',
					notifies: 0
				},

				{
					ref: '/albums',
					iconPath: '../html/img/nav_icons/photos.svg',
					hoveredIconPath: '../html/img/nav-icons/photos_hover.svg',
					title: 'Фотографии',
					notifies: 0
				},

				{
					ref: '/friends',
					iconPath: '../html/img/nav-icons/friends.svg',
					hoveredIconPath: '../html/img/nav-icons/friends_hover.svg',
					title: 'Друзья',
					notifies: 0
				},

				{
					ref: '/groups',
					iconPath: '../html/img/nav-icons/groups.svg',
					hoveredIconPath: '../html/img/nav-icons/groups_hover.svg',
					title: 'Сообщества',
					notifies: 0
				},

				{
					ref: '/bookmarks',
					iconPath: '../html/img/nav_icons/bookmarks',
					hoveredIconPath: '../html/img/nav-icons/bookmarks_hover',
					title: 'Закладки',
					notifies: 0
				}
				]
			};

	const sideBar = new SideBar(parent, 'Depeche', '../html/img/logo.svg', navItems.pages);

	sideBar.render();
} 


function renderHeader(parent) {
    const tmpConfig = {
        profileUrl: '#',
        avatar: 'static/default_avatar.svg'
    }

    const header = new Header(parent)
    header.config = tmpConfig
    header.render()
}

function renderCreatePost(parent) {
    const tmpConfig = {
        avatar: 'static/default_avatar.svg'
    }
    const createPost = new CreatePost(parent)
    createPost.config = tmpConfig
    createPost.render()
}

