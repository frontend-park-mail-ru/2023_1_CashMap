import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";

export default class ProfileView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'profile';
		this.curPage = false;

		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('profileCard', Handlebars.templates.profileCard)
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea)
		Handlebars.registerPartial('post', Handlebars.templates.post)
		Handlebars.registerPartial('createPost', Handlebars.templates.createPost)
		Handlebars.registerPartial('commentArea', Handlebars.templates.commentArea)
		Handlebars.registerPartial('comment', Handlebars.templates.comment)
	}

	_addPagesElements() {

	}

	_addPagesListener() {
		const exitItem = document.getElementById('js-exit-btn');
		exitItem.addEventListener('click', () => {
			actionUser.signOut();
		})
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	updatePage() {
		if (this.curPage) {
			//alert('profile');
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				console.log(4444444)
				this._render();
			}
		}
	}

	showPage() {
		//alert('show profile')
		if (userStore.user.isAuth === false) {
			console.log(userStore.user.isAuth);
			Router.go('/signIn');
		} else {
			actionUser.getUserInfo();
			actionPost.getPostsByUser('id1', 10);
			console.log(11133311)
			this._render();
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.profile;
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
