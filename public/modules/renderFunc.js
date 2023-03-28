import signUp from "./signup.js";
import signIn from "./signin.js";
import Ajax from "./ajax.js";

import FeedController from './feed.js'
import SignUp from "../components/signUp/signUp.js";
import SignIn from "../components/signIn/signIn.js";
import Feed from "../components/feed/feed.js";

function renderFeed(parent) {
    const request = Ajax.get('/api/feed?batch_size=10');
    request
        .then(response => {
            if (response.status === 200) {
                for (const post of response.body.posts) {
                    renderPost(parent, post)
                }

                let el = document.getElementsByClassName('comment')
                el = Array.prototype.slice.call(el);

                for (let i = 0; i < el.length; i++) {
                    el[i].addEventListener('mouseover', (e) => {
                        e.preventDefault();

                        let elPic = el[i].getElementsByClassName('comment-edit-block')
                        elPic = Array.prototype.slice.call(elPic)[0];

                        elPic.classList.remove('opacity-pic')
                        console.log(i)
                    });

                    el[i].addEventListener('mouseout', (e) => {
                        e.preventDefault();

                        let elPic = el[i].getElementsByClassName('comment-edit-block')
                        elPic = Array.prototype.slice.call(elPic)[0];

                        elPic.classList.add('opacity-pic')
                        console.log(i)
                        //comment-edit-block
                    });
                }

                return
            } else {
                alert(response.message)
            }
        })
        .catch(response =>{
            alert('catch! '+ response.message)
        })
}


function renderPost(parent, postData) {
    const staticPaths = {
        postEditIconPath: "static/img/post_icons/post_menu.svg",
        likeIconPath: "static/img/post_icons/like.svg",
        clickedLikeIconPath: "static/img/post_icons/like_clicked.svg",
        commentIconPath: "static/img/post_icons/comment.svg",
        bookmarkIconPath: "static/img/post_icons/bookmark.svg",
        clickedBookmarkIconPath: "static/img/post_icons/bookmark_clicked.svg"
    }

    console.log(222222222222222);
    const a = Date.parse(postData.date);
    // const options = { dateStyle: 'full', weekday: 'short', year: 'numeric',  day: 'numeric' };
    const options = { dateStyle: 'long' };
    console.log((new Date(a)).toLocaleDateString('ru-RU', options));

    postData.senderPhoto = "static/img/post_icons/profile_image.svg";

    const post = new Post(parent, postData, staticPaths);
    let postBlock = post.render();

    renderCommentArea(postBlock, postData.comments);
}

function renderCommentArea(parent, comments) {
    const staticPaths = {
        attachPhotoIconPath: "static/img/post_icons/photo.svg",
        attachHoveredPhotoIconPath: "static/img/post_icons/photo_hover.svg",
        attachSmileIconPath: "static/img/post_icons/smile.svg",
        attachHoveredSmileIconPath: "static/img/post_icons/smile_hover.svg",
        sendIconPath: "static/img/post_icons/send.svg"
    }


    let user = {
        photoPath: "static/img/post_icons/profile_image.svg"
    }

    const commentsArea = new CommentArea(parent, user, staticPaths);

    let commentList = commentsArea.render();


    for (const data of comments) {
        renderComment(commentList, data);
    }
}

function renderComment(parent, commentData) {
    console.log(commentData);
    const staticPaths = {
        edit: "static/img/comment_icons/edit.svg",
        delete: "static/img/comment_icons/delete.svg"
    }

    commentData.senderPhotoPath = "static/img/post_icons/profile_image.svg";

    const comment = new Comment(parent, commentData, staticPaths);
    comment.render();
}

function renderSideBar(parent) {
    const navItems = {
        pages: [
            {
                ref: '/profile',
                iconPath: 'static/img/nav_icons/profile.svg',
                hoveredIconPath: 'static/img/nav_icons/profile_hover.svg',
                title: 'Моя страница',
                notifies: 0
            },

            {
                ref: '/feed',
                iconPath: 'static/img/nav_icons/news.svg',
                hoveredIconPath: 'static/img/nav_icons/news_hover.svg',
                title: 'Новости',
                notifies: 0
            },

            {
                ref: '/msg',
                iconPath: 'static/img/nav_icons/messenger.svg',
                hoveredIconPath: 'static/img/nav_icons/messenger_hover.svg',
                title: 'Мессенджер',
                notifies: 0
            },

            {
                ref: '/albums',
                iconPath: 'static/img/nav_icons/photos.svg',
                hoveredIconPath: 'static/img/nav_icons/photos_hover.svg',
                title: 'Фотографии',
                notifies: 0
            },

            {
                ref: '/friends',
                iconPath: 'static/img/nav_icons/friends.svg',
                hoveredIconPath: 'static/img/nav_icons/friends_hover.svg',
                title: 'Друзья',
                notifies: 0
            },

            {
                ref: '/groups',
                iconPath: 'static/img/nav_icons/groups.svg',
                hoveredIconPath: 'static/img/nav_icons/groups_hover.svg',
                title: 'Сообщества',
                notifies: 0
            },

            {
                ref: '/bookmarks',
                iconPath: 'static/img/nav_icons/bookmarks.svg',
                hoveredIconPath: 'static/img/nav_icons/bookmarks_hover.svg',
                title: 'Закладки',
                notifies: 0
            }
        ]
    };

    const sideBar = new SideBar(parent, 'Depeche', 'static/img/logo.svg', navItems.pages);

    sideBar.render();
}


export function renderHeader(parent) {
    const tmpConfig = {
        profileUrl: '#',
        avatar: 'static/img/post_icons/profile_image.svg'
    }

    const header = new Header(parent)
    header.config = tmpConfig
    header.render()
}

export function renderCreatePost(parent) {
    const tmpConfig = {
        avatar: 'static/img/post_icons/profile_image.svg'
    }
    const createPost = new CreatePost(parent)
    createPost.config = tmpConfig
    createPost.render()
}


// render pages

export function renderFeedPageLast() {
    const rootElement = document.getElementById('root')
    const main = document.createElement('div');
    main.classList.add('main');
    rootElement.appendChild(main);

    const content = document.createElement('div');
    content.classList.add('main-content');
    main.appendChild(content);

    const feed = document.createElement('div');
    feed.classList.add('feed');
    content.appendChild(feed);

    renderHeader(content)
    renderCreatePost(content)
    renderSideBar(main);
    renderFeed(feed);

    const mainElem = document.querySelector('.main');
    const feedController = new FeedController(mainElem);
    feedController.setup();
}

export function renderFeedPage() {
    const request = Ajax.get('/api/feed?batch_size=10');
    request
        .then(response => {
            if (response.status === 200) {
                const posts = response.body.posts;

                for (let i = 0; i < posts.length; i++) {
                    posts[i].date = (new Date(posts[i].date)).toLocaleDateString('ru-RU', { dateStyle: 'medium' })
                    posts[i].senderPhoto = 'static/img/post_icons/profile_image.svg';
                    posts[i].commentsCount = posts[i].comments.length;
                }

                const rootElement = document.getElementById('root');
                const createFeed = new Feed(rootElement, posts)
                createFeed.render()
                // ToDo: дописать метод для слушанья кнопопк
            } else {
                alert('renderFeedPage not 200');
            }
        })
        .catch(response =>{
            alert('catch renderFeedPage '+ response.message)
        })
}

export function renderSignupPage() {
    const rootElement = document.getElementById('root');
    const createSignup = new SignUp(rootElement)
    createSignup.render()
    signUp()
}

export function renderLoginPage() {
    const rootElement = document.getElementById('root');
    const createLogin = new SignIn(rootElement)
    createLogin.render()
    signIn()
}
