import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst} from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";
import BaseView from "./baseView.js";

export default class CreatePostView extends BaseView {
	constructor() {
		super();
		this._jsId = 'edit-post';
	}

	addStore() {
		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();
		this._text = document.getElementById('js-edit-post-textarea');
		this._text.focus();

		this._editBtn = document.getElementById('js-edit-post-btn');

		var textarea = document.getElementsByTagName('textarea');
		textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
		textarea[0].addEventListener("input", OnInput, false);
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}
	}

	addPagesListener() {
		super.addPagesListener();
		this._editBtn.addEventListener('click', () => {
			actionPost.createPostUser(userStore.user.user_link, userStore.user.user_link, true, this._text.value);
			Router.goBack();
		});
	}

	showPage() {
		actionUser.getProfile();
	}

	_preRender() {
		this._template = Handlebars.templates.editPostPage;

		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			editPostData: {
				avatar_url: userStore.user.avatar_url,
				text: '',
				buttonData: {
					text: 'Опубликовать',
					jsId: 'js-edit-post-btn'
				}
			},
		}
	}
}