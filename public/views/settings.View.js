import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";

export default class SetingsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'settings';
		this.curPage = false;
        this.init = false;

		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header)
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('settingsPath', Handlebars.templates.settingsPath)
	}

	_addPagesElements() {
		this._exitBtn = document.getElementById('js-exit-btn');

		this._myPageItem = document.getElementById('js-side-bar-my-page');
		this._newsItem = document.getElementById('js-side-bar-news');
		this._msgItem = document.getElementById('js-side-bar-msg');
		this._photoItem = document.getElementById('js-side-bar-photo');
		this._friendsItem = document.getElementById('js-side-bar-friends');
		this._groupsItem = document.getElementById('js-side-bar-groups');
		this._bookmarksItem = document.getElementById('js-side-bar-bookmarks');
	}

	_addPagesListener() {
		this._exitBtn.addEventListener('click', () => {
			actionUser.signOut();
		})

		this._friendsItem.addEventListener('click', () => {
			Router.go('/friends');
		})

		this._myPageItem.addEventListener('click', () => {
			Router.go('/profile');
		})

		this._newsItem.addEventListener('click', () => {
			Router.go('/feed');
		})
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	updatePage() {
		if (this.curPage) {
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				this._render();
			}
		}
	}

	showPage() {
		if (userStore.user.isAuth === false) {
			console.log(userStore.user.isAuth);
			Router.go('/signIn');
		} else {
			actionUser.getUserInfo();
			actionPost.getPostsByUser('id1', 10);
			this._render();
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.settings;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			//profileData: userStore.user,
			profileData: {
                id: 1,
				avatar: 'static/img/post_icons/profile_image.svg',
				firstName: 'Карина',
				lastName: 'Анохина',
				status: 'Это мой статус)))',
				birthday: '01.01.2000'
            },
			// this.user = {
			// 	isAuth: false,
			// 	errorAuth: '',
			// 	errorReg: '',
	
			// 	link: null,
			// 	firstName: null,
			// 	lastName: null,
			// 	email: null,
			// 	avatar: null,
			// };
			postAreaData: {createPostData: {avatar: userStore.user.avatar}, postList: postsStore.posts},
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
