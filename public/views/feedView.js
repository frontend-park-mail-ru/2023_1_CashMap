import PostsStore from "../stores/postsStore.js";
import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import UserStore from "../stores/userStore.js";

export default class FeedView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'feed';

		actionUser.getUserInfo();
		actionPost.getPosts(10, 0);

		PostsStore.registerCallback(this.render);
		UserStore.registerCallback(this.render);
	}

	_addHandlebarsPartial() {
		Handlebars.registerPartial('inputField', Handlebars.templates.inputField);
		Handlebars.registerPartial('button', Handlebars.templates.button);
		Handlebars.registerPartial('sideBar', Handlebars.templates.sideBar);
		Handlebars.registerPartial('header', Handlebars.templates.header);
		Handlebars.registerPartial('postArea', Handlebars.templates.postArea);
		Handlebars.registerPartial('menuItem', Handlebars.templates.menuItem);
		Handlebars.registerPartial('post', Handlebars.templates.post);
		Handlebars.registerPartial('createPost', Handlebars.templates.createPost);
		Handlebars.registerPartial('commentArea', Handlebars.templates.commentArea);
		Handlebars.registerPartial('comment', Handlebars.templates.comment);
	}

	_addPagesElements() {

	}

	_addPagesListener() {
		let el = document.getElementsByClassName('comment')
		el = Array.prototype.slice.call(el);

		for (let i = 0; i < el.length; i++) {
			el[i].addEventListener('mouseover', (e) => {
				e.preventDefault();

				let elPic = el[i].getElementsByClassName('comment-operations')
				elPic = Array.prototype.slice.call(elPic)[0];

				elPic.classList.remove('opacity-pic')
				console.log(i)
			});

			el[i].addEventListener('mouseout', (e) => {
				e.preventDefault();

				let elPic = el[i].getElementsByClassName('comment-operations')
				elPic = Array.prototype.slice.call(elPic)[0];

				elPic.classList.add('opacity-pic')
				console.log(i)
				//comment-edit-block
			});
		}

		const exitItem = document.getElementById('js-exit-btn');
		exitItem.addEventListener('click', () => {
			actionUser.signOut();
		})
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	render() {
		if (!userStore.user.isAuth) {
			Router.go('/signIn');
			return;
		}
		if (Router.currentPage !== this) {
			return;
		}

		let header = headerConst;
		header['avatar'] = userStore.user.avatar;

		const template = Handlebars.templates.feed;
		Router.rootElement.innerHTML = template({
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData: {createPostData: {avatar: userStore.user.avatar}, postList: PostsStore.posts},
		});

		this._addPagesElements();

		this._addPagesListener();
	}

}
