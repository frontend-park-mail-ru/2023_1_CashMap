import userStore from "../stores/userStore.js";
import { sideBarConst, headerConst, maxTextStrings, maxTextLength, activeColor } from "../static/htmlConst.js";
import {actionUser} from "../actions/actionUser.js";
import {actionPost} from "../actions/actionPost.js";
import postsStore from "../stores/postsStore.js";
import BaseView from "./baseView.js";

export default class FeedView extends BaseView {
	constructor() {
		super();

		this._jsId = 'feed';
		this.curPage = false;

		this._commentBatchToLoad = 5;

		this.isCreate = false;
		this.isEdit = false;
	}

	addStore() {
		postsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._newsItem.style.color = activeColor;

		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

    this._createPosts = document.getElementById('js-create-post');
		this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');
		this._commentsButtons = document.getElementsByClassName("post-buttons-comment");
		this._commentsAreas = document.getElementsByClassName("comments-area");
		this._sendCommentButtons = document.getElementsByClassName('create-comment__send-icon');
		this._commentInput = document.getElementsByClassName('create-comment__input');

		this._commentDeleteButton = document.getElementsByClassName("comment-operations__delete");

		this._commentEditButton = document.getElementsByClassName("comment-operations__update");
		this._commentEditSaveButton = document.getElementsByClassName("submit-comment-edit-button");
		this._commentEditCancelButton = document.getElementsByClassName("cancel-comment-edit-button");
		this._commentEditInput = document.getElementsByClassName("comment-edit-input");

		this._showMoreCommentsButton = document.getElementsByClassName("show-more-block");

		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');
	}

	addPagesListener() {
		super.addPagesListener();

		this._text = document.getElementById('js-edit-post-textarea');
		function OnInput() {
			this.style.height = 'auto';
			this.style.height = (this.scrollHeight) + 'px';
		}

		if (this._text) {
			this._text.focus();

			this._editBtn = document.getElementById('js-edit-post-btn');
			let textarea = document.getElementsByTagName('textarea');

			textarea[0].setAttribute('style', 'height:' + (textarea[0].scrollHeight) + 'px;');
			textarea[0].addEventListener("input", OnInput, false);
		}

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		for (let i = 0; i < this._likePosts.length; i++) {
				this._likePosts[i].addEventListener('click', () => {
						const postId = this._likePosts[i].getAttribute("data-id");
						actionPost.likePost(Number(postId));
				});
		}

		for (let i = 0; i < this._dislikePosts.length; i++) {
			this._dislikePosts[i].addEventListener('click', () => {
					const postId = this._dislikePosts[i].getAttribute("data-id");
					actionPost.dislikePost(Number(postId));
			});
		}

		this._createPosts.addEventListener('click', () => {
			localStorage.removeItem('groupLink');
			Router.go('/createPost', false);
		});

		for (let i = 0; i < this._commentsButtons.length; i++) {
			this._commentsButtons[i].addEventListener('click', () => {
				if (postsStore.comments.get(postsStore.friendsPosts[i].id) === undefined || postsStore.comments.get(postsStore.friendsPosts[i].id).length === 0) {
					actionPost.getComments(postsStore.friendsPosts[i].id, this._commentBatchToLoad);
				} else {
					postsStore.comments.delete(postsStore.friendsPosts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");

					this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
					postsStore.haveCommentsContinuation.delete(postsStore.friendsPosts[i].id);
				}
			})
		}

		for (let i = 0; i < this._sendCommentButtons.length; ++i) {
			this._sendCommentButtons[i].addEventListener('click', () => {
				if (this._commentInput[i].value.trim() !== '') {
					actionPost.createComment(postsStore.friendsPosts[i].id, this._commentInput[i].value.trim(), null);
				}
			})

		}

		for (let i = 0; i < this._commentInput.length; ++i) {
			this._commentInput[i].addEventListener('keyup', (event) => {
				if (this._commentInput[i].value.trim() !== '' && event.code === 'Enter' && document.activeElement === this._commentInput[i]) {
					actionPost.createComment(postsStore.friendsPosts[i].id, this._commentInput[i].value.trim(), null);
				}
			})
		}

		for (let i = 0; i < this._commentDeleteButton.length; ++i) {
			this._commentDeleteButton[i].addEventListener('click', () => {
				let commentID = this._commentDeleteButton[i].getAttribute('data-comment-id');
				actionPost.deleteComment(commentID);

				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore.comments.get(postID);

				for (let j = 0; j < comments.length; ++j) {
					if (comments[j].id === Number(commentID)) {
						comments.splice(j, 1);
						break;
					}
				}
				postsStore.comments.set(postID, comments);

				for (let i = 0; i < postsStore.friendsPosts.length; ++i) {
					if (postsStore.friendsPosts[i].id === postID) {
						postsStore.friendsPosts[i].comments_amount--;
					}
				}
				this.updatePage();
			})
		}

		for (let i = 0; i < this._commentEditButton.length; ++i) {
			this._commentEditButton[i].addEventListener('click', () => {
				let postID = Number(this._commentDeleteButton[i].getAttribute('data-post-id'));
				let comments = postsStore.comments.get(postID);

				let commentID = Number(this._commentDeleteButton[i].getAttribute('data-comment-id'));

				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = true;
					}
				}

				this.updatePage();
			})
		}

		for (let i = 0; i < this._commentEditSaveButton.length; ++i) {
			this._commentEditSaveButton[i].addEventListener('click', () => {
				let newCommentText = this._commentEditInput[i].value.trim();
				if (this._commentEditInput[i].value.trim() !== '') {
					let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));
					actionPost.editComment(commentID, newCommentText);

					let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
					let comments = postsStore.comments.get(postID);
					for (let i = 0; i < comments.length; ++i) {
						if (comments[i].id === commentID) {
							comments[i].editing_mode = false;
							comments[i].text = newCommentText;
						}
					}

				}
			})
		}

		for (let i = 0; i < this._commentEditCancelButton.length; ++i) {
			this._commentEditCancelButton[i].addEventListener('click', () => {
				let commentID = Number(this._commentEditSaveButton[i].getAttribute('data-comment-id'));

				let postID = Number(this._commentEditSaveButton[i].getAttribute('data-post-id'));
				let comments = postsStore.comments.get(postID);
				for (let i = 0; i < comments.length; ++i) {
					if (comments[i].id === commentID) {
						comments[i].editing_mode = false;
					}
				}

				this.updatePage();
			})
		}

		for (let i = 0; i < this._showMoreCommentsButton.length; ++i) {
			this._showMoreCommentsButton[i].addEventListener('click', () => {
				let postID = Number(this._showMoreCommentsButton[i].getAttribute('data-post-id'));

				console.log(postID)
				let lastCommentDate = postsStore.comments.get(postID).at(-1).raw_creation_date;
				console.log(lastCommentDate);


				for (let i = 0; i < postsStore.friendsPosts.length; ++i) {
					if (postsStore.friendsPosts[i].id === postID) {
						actionPost.getComments(postID, this._commentBatchToLoad, lastCommentDate);
						break;
					}
				}


				// this.updatePage();
			})
		}

		for (let i = 0; i < this._postsTexts.length; i++) {
			const text = this._postsTexts[i].textContent
			if (text.split('\n').length > maxTextStrings || text.length > maxTextLength) {
				const post = this._postsTexts[i];
				let shortText;

				if (text.length > maxTextLength) {
					shortText = text.slice(0, maxTextLength) + '...';
				} else {
					const ind = text.indexOf('\n', text.indexOf('\n', text.indexOf('\n') + 1) + 1);
					shortText = text.slice(0, ind) + '...';
				}
				post.textContent = shortText;

				const openButton = document.createElement('div');
				openButton.textContent = 'Показать еще';
				openButton.style.color = '#9747FF';
				openButton.style.cursor = 'pointer';

				post.appendChild(openButton);
				openButton.addEventListener('click', function() {
					post.textContent = text;
				});
			}
		}

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				this.isEdit = this._editPosts[i].getAttribute("data-id");
				this.isCreate = false;
				actionPost.getPostsById(this.isEdit, 1);
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				this.isCreate = true;
				this.isEdit = false;
				super.render();
				this._text.focus();
			});
		}

		if (this._editBtn) {
			this._editBtn.addEventListener('click', () => {
				actionPost.editPost(this._text.value, this.isEdit);
				this.isEdit = false;
			});
		}

		if (this._createBtn) {
			this._createBtn.addEventListener('click', () => {
				actionPost.createPostUser(userStore.user.user_link, userStore.user.user_link, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				super.render();
			});
		}
	}


	showPage() {
		actionUser.getProfile(() => { actionPost.getFriendsPosts(15); });
		/*if (localStorage.getItem('groupLink')) {
			actionGroups.getGroupInfo(null, localStorage.getItem('groupLink'));
		}*/
	}

	_preRender() {
		this._template = Handlebars.templates.feed;

		for (let i = 0; i < postsStore.friendsPosts.length; ++i) {
			postsStore.friendsPosts[i].comments = postsStore.comments.get(postsStore.friendsPosts[i].id);
			postsStore.friendsPosts[i].has_next = postsStore.haveCommentsContinuation.get(postsStore.friendsPosts[i].id);
		}


		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;
		this._context = {
			sideBarData: sideBarConst,
			headerData: header,
			postAreaData:
			{
				createPostData:
				{
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: userStore.user.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: userStore.user.avatar_url, text: '', buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, buttonData1: { text: 'Отменить', jsId: 'js-back-post-btn' },}
				},
				postList: postsStore.posts
			},
		}

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore.curPost.id;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
}
