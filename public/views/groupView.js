import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import { sideBarConst, headerConst, maxTextStrings, maxTextLength } from "../static/htmlConst.js";
import {actionPost} from "../actions/actionPost.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import { actionGroups } from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";
import { actionUser } from "../actions/actionUser.js";

export default class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'group';
		this._groupLink = null;

		this._commentBatchToLoad = 5;
	}

	/**
	 * @private метод, отправляющий callback, которые вызываются при изменении определенных Store.
	 */
	addStore() {
		groupsStore.registerCallback(this.updatePage.bind(this));
		userStore.registerCallback(this.updatePage.bind(this));
		postsStore.registerCallback(this.updatePage.bind(this));
	}

	addPagesElements() {
		super.addPagesElements();

		this._groupSettingsBtn = document.getElementById('js-group-settings-btn');
		this._groupSub = document.getElementById('js-group-sub-btn');
		this._groupUnsub = document.getElementById('js-group-unsub-btn');
		this._groupDelete = document.getElementById('js-group-delete-btn');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
		this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');

		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

		this._commentsAreas = document.getElementsByClassName("comments-area");
		this._commentsButtons = document.getElementsByClassName("post-buttons-comment");
		this._sendCommentButtons = document.getElementsByClassName('create-comment__send-icon');
		this._commentInput = document.getElementsByClassName('create-comment__input');

		this._commentDeleteButton = document.getElementsByClassName("comment-operations__delete");

		this._commentEditButton = document.getElementsByClassName("comment-operations__update");
		this._commentEditSaveButton = document.getElementsByClassName("submit-comment-edit-button");
		this._commentEditCancelButton = document.getElementsByClassName("cancel-comment-edit-button");
		this._commentEditInput = document.getElementsByClassName("comment-edit-input");

		this._showMoreCommentsButton = document.getElementsByClassName("show-more-block");

	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._editPosts.length; i++) {
			this._editPosts[i].addEventListener('click', () => {
				const postId = this._editPosts[i].getAttribute("data-id");
				localStorage.setItem('editPostId', postId);
				Router.go('/editPost', false);
			});
		}

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		if (this._createPosts) {
			this._createPosts.addEventListener('click', () => {
				localStorage.setItem('groupLink', this._groupLink);
				Router.go('/createPost', false);
			});
		}

		if (this._groupSub) {
			this._groupSub.addEventListener('click', () => {
				actionGroups.groupSub(this._groupLink);
			});
		}

		if (this._groupUnsub) {
			this._groupUnsub.addEventListener('click', () => {
				actionGroups.groupUnsub(this._groupLink);
			});
		}

		if (this._groupDelete) {
			this._groupDelete.addEventListener('click', () => {
				actionGroups.deleteGroup(this._groupLink);
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


		for (let i = 0; i < this._commentsButtons.length; i++) {
			this._commentsButtons[i].addEventListener('click', () => {
				if (postsStore.comments.get(postsStore.friendsPosts[i].id) === undefined || postsStore.comments.get(postsStore.friendsPosts[i].id).length === 0) {
					actionPost.getComments(postsStore.friendsPosts[i].id, this._commentBatchToLoad);
				} else {
					postsStore.comments.delete(postsStore.friendsPosts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");
					if (showMoreCommentButton.length !== 0) {
						this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
						postsStore.haveCommentsContinuation.delete(postsStore.friendsPosts[i].id);
					}
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

		if (this._groupSettingsBtn) {
			this._groupSettingsBtn.addEventListener('click', () => {
				Router.go('/settingsGroup?link=' + this._groupLink, false);
			});
		}

	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, 15); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink); });
		} else {
			Router.go('/groups', false);
		}
	}


	_preRender() {
		this._template = Handlebars.templates.group;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		for (let i = 0; i < postsStore.friendsPosts.length; ++i) {
			postsStore.friendsPosts[i].comments = postsStore.comments.get(postsStore.friendsPosts[i].id);
			postsStore.friendsPosts[i].has_next = postsStore.haveCommentsContinuation.get(postsStore.friendsPosts[i].id);
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore.curGroup,
			postAreaData: {createPostData: {displayNone: !groupsStore.curGroup.isAdmin, avatar_url: groupsStore.curGroup.avatar_url, jsId: 'js-create-post'}, postList: postsStore.friendsPosts},
		}
	}
}
