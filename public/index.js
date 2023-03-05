import {SideBar} from './components/sidebar/sidebar.js';
import Header from "./components/header/header.js";
import CreatePost from "./components/createPost/createPost";

const rootElement = document.getElementById('root');
const main = document.getElementsByClassName('main')[0];
rootElement.appendChild(main);
renderSideBar(main);


function renderSideBar(parent) {
    const navItems = {
        pages: [
            {
                ref: '/profile',
                iconPath: '../html/img/nav_icons/profile.svg',
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
