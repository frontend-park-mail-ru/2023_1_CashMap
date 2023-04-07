import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionFriends} from "../actions/actionFriends.js";
import friendsStore from "../stores/friendsStore.js";

export default class FriendsView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'friends';
		this.curPage = false;

		friendsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField)
		Handlebars.registerPartial('button', Handlebars.templates.button)
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar)
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem)
		Handlebars.registerPartial('search', Handlebars.templates.search)
		Handlebars.registerPartial('friend', Handlebars.templates.friend)
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
			//alert('friends');
			if (!userStore.user.isAuth) {
				Router.go('/signIn');
			} else {
				console.log(22222)
				this._render();
			}
		}
	}

	showPage() {
		//alert('show friends')
		if (userStore.user.isAuth === false) {
			console.log(userStore.user.isAuth);
			Router.go('/signIn');
		} else {
			actionUser.getUserInfo();
			actionFriends.getFriends(15, 0);
			console.log(11111)
			this._render();
		}
	}

	_render() {
		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.friends;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			friendsData: friendsStore.friends,
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
