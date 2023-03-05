import SideBar from './components/sidebar/sidebar.js'
import Post from './components/post/post.js'
import Comment from './components/comment/comment.js'
import Header from './components/header/header.js'
import CreatePost from './components/createPost/createPost.js'
import CommentArea from './components/commentArea/commentArea.js'
import Login from './components/login/login.js'
import Signup from './components/signup/signup.js'

import Ajax from './modules/ajax.js'

const rootElement = document.getElementById('root')
// const main = document.createElement('div');
// main.classList.add('main');
// rootElement.appendChild(main);

// const content = document.createElement('div');
// content.classList.add('main-content');
// main.appendChild(content);

// const feed = document.createElement('div');
// feed.classList.add('feed');
// content.appendChild(feed);

// renderHeader(content)
// renderCreatePost(content)
// renderSideBar(main);
// renderFeed(feed);

// const commentButton = document.querySelector('.post-comments-icon img');
// commentButton.addEventListener('click', function() {
// 	renderCommentArea()
// })

// function renderCommentArea(parent) {

// }

const request = Ajax.get('http://95.163.212.121:8080/api/feed')

let posts

request
  .then(response => {
    if (response.ok) {
      alert('Unauthorized')
      return
    }
    posts = response.response
  }
  )
  .catch(response => {
    alert(response)
  })

function renderFeed (parent) {
  const posts = [
    {
      senderName: 'Pavel Repin',
      senderPhoto: 'static/img/post_icons/profile_image.svg',
      date: '1 ноя 2019',
      body: 'lorem ipsum lorem ipsum lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber commentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumbercommentsNumberv',
      likeNumber: 10,
      commentsNumber: 4,
      comments: [
        {
          senderName: 'Карина Анохина',
          senderPhotoPath: 'static/img/nav_icons/profile.svg',
          date: '1 ноя 2019',
          body: 'Увау, классно мыслишь!'
        },

        {
          senderName: 'Карина Анохина',
          senderPhotoPath: 'static/img/nav_icons/profile.svg',
          date: '1 ноя 2019',
          body: 'Увау, классно мыслишь!'
        }
      ]
    },

    {
      senderName: 'Egor Larkin',
      senderPhoto: 'static/img/post_icons/profile_image.svg',
      date: '1 ноя 2007',
      body: 'lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber',
      likeNumber: 122,
      commentsNumber: 400
    },

    {
      senderName: 'Egor Larkin',
      senderPhoto: 'static/img/post_icons/profile_image.svg',
      date: '1 ноя 2007',
      body: 'lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber',
      likeNumber: 122,
      commentsNumber: 400
    },

    {
      senderName: 'Egor Larkin',
      senderPhoto: 'static/img/post_icons/profile_image.svg',
      date: '1 ноя 2007',
      body: 'lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber',
      likeNumber: 122,
      commentsNumber: 400,
      comments: [
        {
          senderName: 'Карина Анохина',
          senderPhotoPath: 'static/img/nav_icons/profile.svg',
          date: '1 ноя 2019',
          body: 'Увау, классно мыслишь!'
        }
      ]
    },

    {
      senderName: 'Egor Larkin',
      senderPhoto: 'static/img/post_icons/profile_image.svg',
      date: '1 ноя 2007',
      body: 'lorem ipsum lorem  ipsumlorem ipsumlorem ipsum commentsNumbercommentsNumbercommentsNumber',
      likeNumber: 122,
      commentsNumber: 400
    }
  ]

  for (const post of posts) {
    renderPost(parent, post)
  }
}

function renderPost (parent, postData) {
  const staticPaths = {
    postEditIconPath: 'static/img/post_icons/post_menu.svg',
    likeIconPath: 'static/img/post_icons/like.svg',
    clickedLikeIconPath: 'static/img/post_icons/like_clicked.svg',
    commentIconPath: 'static/img/post_icons/comment.svg',
    bookmarkIconPath: 'static/img/post_icons/bookmark.svg',
    clickedBookmarkIconPath: 'static/img/post_icons/bookmark_clicked.svg'
  }

  const post = new Post(parent, postData, staticPaths)
  const postBlock = post.render()

  renderCommentArea(postBlock)
}

function renderCommentArea (parent) {
  const staticPaths = {
    attachPhotoIconPath: 'static/img/post_icons/photo.svg',
    attachHoveredPhotoIconPath: 'static/img/post_icons/photo_hover.svg',
    attachSmileIconPath: 'static/img/post_icons/smile.svg',
    attachHoveredSmileIconPath: 'static/img/post_icons/smile_hover.svg',
    sendIconPath: 'static/img/post_icons/send.svg'
  }

  const commentsData = [
    {
      senderName: 'Карина Анохина',
      senderPhotoPath: 'static/img/post_icons/profile_image.svg',
      body: 'Lorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumlorem',
      date: '1 ноя 2019'
    },

    {
      senderName: 'Карина Анохина',
      senderPhotoPath: 'static/img/post_icons/profile_image.svg',
      body: 'Lorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumloremLorem ipsumlorem',
      date: '1 ноя 2019'
    }
  ]

  const user = {
    photoPath: 'static/img/post_icons/profile_image.svg'
  }

  const commentsArea = new CommentArea(parent, user, staticPaths)

  const commentList = commentsArea.render()

  for (const data of commentsData) {
    renderComment(commentList, data)
  }
}

function renderComment (parent, commentData) {
  const staticPaths = {
    edit: 'static/img/comment_icons/edit.svg',
    delete: 'static/img/comment_icons/delete.svg'
  }

  const comment = new Comment(parent, commentData, staticPaths)
  comment.render()
}

function renderSideBar (parent) {
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
  }

  const sideBar = new SideBar(parent, 'Depeche', 'static/img/logo.svg', navItems.pages)

  sideBar.render()
}

function renderHeader (parent) {
  const tmpConfig = {
    profileUrl: '#',
    avatar: 'static/img/post_icons/profile_image.svg'
  }

  const header = new Header(parent)
  header.config = tmpConfig
  header.render()
}

function renderCreatePost (parent) {
  const tmpConfig = {
    avatar: 'static/img/post_icons/profile_image.svg'
  }
  const createPost = new CreatePost(parent)
  createPost.config = tmpConfig
  createPost.render()
}

function renderSignup (parent) {
  const createSignup = new Signup(parent, 'static/img/logo.svg', 'static/img/background_left.svg')

  createSignup.render()
}

function renderLogin (parent) {
  const createLogin = new Login(parent, 'static/img/logo.svg', 'static/img/background_right.svg')

  createLogin.render()
}

function renderMainPage () {
  const main = document.createElement('div')
  main.classList.add('main')
  rootElement.appendChild(main)

  const content = document.createElement('div')
  content.classList.add('main-content')
  main.appendChild(content)

  const feed = document.createElement('div')
  feed.classList.add('feed')
  content.appendChild(feed)

  renderHeader(content)
  renderCreatePost(content)
  renderSideBar(main)
  renderFeed(feed)
}

renderLogin(rootElement)
