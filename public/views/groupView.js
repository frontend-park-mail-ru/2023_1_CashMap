import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";
import {sideBarConst, headerConst, maxTextStrings, maxTextLength, friendsMenuInfo, emotionKeyboard} from "../static/htmlConst.js";
import {actionPost} from "../actions/actionPost.js";
import BaseView from "./baseView.js";
import postsStore from "../stores/postsStore.js";
import { actionGroups } from "../actions/actionGroups.js";
import groupsStore from "../stores/groupsStore.js";
import { actionUser } from "../actions/actionUser.js";
import {actionImg} from "../actions/actionImg.js";
import Ajax from "../modules/ajax.js";
import {actionSearch} from "../actions/actionSearch.js";
import searchStore from "../stores/dropdownSearchStore.js";

export default class GroupView extends BaseView {
	constructor() {
		super();
		this._jsId = 'group';
		this._groupLink = null;

		this._commentBatchToLoad = 5;

		this.isCreate = false;
		this.isEdit = false;

		this._postsBatchSize = 15;
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
		this._deletePosts = document.getElementsByClassName('post-menu-item-delete');
		this._createPosts = document.getElementById('js-create-post');
		this._postsTexts = document.getElementsByClassName('post-text');
		this._posts = document.getElementsByClassName('post');


		this._createPosts = document.getElementById('js-create-post');
		this._editPosts = document.getElementsByClassName('post-menu-item-edit');
		this._editBtn = document.getElementById('js-edit-post-btn');
		this._createBtn = document.getElementById('js-create-post-btn');
		this._backBtn = document.getElementById('js-back-post-btn');

		this._likePosts = document.getElementsByClassName('post-buttons-like__icon');
		this._dislikePosts = document.getElementsByClassName('post-buttons-dislike__icon');

		this._addPhotoToPostPic = document.getElementById('js-add-photo-to-post-pic');
		this._addPhotoToPost = document.getElementById('js-add-photo-to-post');
		this._addSmileToPost = document.getElementById('js-add-smile-to-post');
		this._removeImg = document.getElementsByClassName('close-button');

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

		this._emotionBtn = document.getElementById('js-post-smiles');
		this._emotionKeyboard = document.getElementById('js-smiles-keyboard');
		this._smiles = document.getElementsByClassName('js-smile');

		this._install = document.getElementsByClassName('js-file-i');


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
	}

	addPagesListener() {
		super.addPagesListener();

		for (let i = 0; i < this._deletePosts.length; i++) {
			this._deletePosts[i].addEventListener('click', () => {
				const postId = this._deletePosts[i].getAttribute("data-id");
				actionPost.deletePost(Number(postId));
			});
		}

		window.addEventListener('scroll', () => {
			if (scrollY + innerHeight  >= document.body.scrollHeight && !this.watingForNewPosts && postsStore.hasMorePosts) {
				actionPost.getPostsByCommunity(this._groupLink, this._postsBatchSize, postsStore.posts.at(-1).raw_creation_date, true);
				this.watingForNewPosts = true;
			}
		});

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
				if (postsStore.comments.get(postsStore.posts[i].id) === undefined || postsStore.comments.get(postsStore.posts[i].id).length === 0) {
					actionPost.getComments(postsStore.posts[i].id, this._commentBatchToLoad);
				} else {
					postsStore.comments.delete(postsStore.posts[i].id);

					let commentsArea = this._posts[i].getElementsByClassName("comments-list");
					commentsArea[0].style.display = 'none';

					let showMoreCommentButton = this._commentsAreas[i].getElementsByClassName("show-more-block");
					if (showMoreCommentButton.length !== 0) {
						this._commentsAreas[i].removeChild(showMoreCommentButton[0]);
						postsStore.haveCommentsContinuation.delete(postsStore.posts[i].id);
					}
				}
			})
		}

		for (let i = 0; i < this._sendCommentButtons.length; ++i) {
			this._sendCommentButtons[i].addEventListener('click', () => {
				if (this._commentInput[i].value.trim() !== '') {
					actionPost.createComment(postsStore.posts[i].id, this._commentInput[i].value.trim(), null);
				}
			})

		}

		for (let i = 0; i < this._commentInput.length; ++i) {
			this._commentInput[i].addEventListener('keyup', (event) => {
				if (this._commentInput[i].value.trim() !== '' && event.code === 'Enter' && document.activeElement === this._commentInput[i]) {
					actionPost.createComment(postsStore.posts[i].id, this._commentInput[i].value.trim(), null);
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

				for (let i = 0; i < postsStore.posts.length; ++i) {
					if (postsStore.posts[i].id === postID) {
						postsStore.posts[i].comments_amount--;
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


				for (let i = 0; i < postsStore.posts.length; ++i) {
					if (postsStore.posts[i].id === postID) {
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

		if (this._addPhotoToPost) {
			this._addPhotoToPost.addEventListener('click', () => {
				this._createPosts.click();
				this._addPhotoToPostPic.click();
			});
		}

		if (this._addSmileToPost) {
			this._addSmileToPost.addEventListener('click', () => {
				this._createPosts.click();
				this._emotionBtn.click();
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
				actionPost.createPostCommunity(userStore.user.user_link, this._groupLink, true, this._text.value);
				this.isCreate = false;
			});
		}

		if (this._backBtn) {
			this._backBtn.addEventListener('click', () => {
				this.isCreate = this.isEdit = false;
				postsStore.attachments = [];
				super.render();
			});
		}

		if (this._addPhotoToPostPic) {
			this._addPhotoToPostPic.addEventListener('click', ()=> {
				if (postsStore.attachments === null) {
					postsStore.attachments = [];
				}
				if (postsStore.attachments.length >= 10) {
					return;
				}
				postsStore.text = this._text.value;
				const fileInput = document.createElement('input');
				fileInput.type = 'file';

				fileInput.addEventListener('change', function (event) {
					const file = event.target.files[0];

					const reader = new FileReader();
					reader.onload = function (e) {
						actionImg.uploadImg(file, (newUrl) => {
							let id = 1;

							if (postsStore.attachments.length) {
								id = postsStore.attachments[postsStore.attachments.length-1].id + 1;
							}
							if (Router._getSearch(newUrl).type === 'img') {
								postsStore.attachments.push({url: Ajax.imgUrlConvert(newUrl), id: id, type: 'img'});
								postsStore.addAttachments.push(newUrl);
							} else {
								postsStore.attachments.push({url: Ajax.imgUrlConvert(newUrl), id: id, type: 'file', filename: file.name});
								postsStore.addAttachments.push(newUrl + `&filename=${file.name}`);
							}

							postsStore._refreshStore();
						});
					};

					reader.readAsDataURL(file);
				});

				fileInput.click();
			});
		}

		for (let i = 0; i < this._removeImg.length; i++) {
			this._removeImg[i].addEventListener('click', () => {
				const imgId = this._removeImg[i].getAttribute("data-id");

				let index = -1;
				for (let i = 0; i < postsStore.attachments.length; i++) {
					if (postsStore.attachments[i].id.toString() === imgId) {
						index = i;
						postsStore.deleteAttachments.push(Ajax.imgUrlBackConvert(postsStore.attachments[i].url));
						break;
					}
				}
				if (index > -1) {
					postsStore.attachments.splice(index, 1);
				}

				postsStore.text = this._text.value;
				postsStore._refreshStore();
			});
		}

		if (this._emotionBtn) {
			this._emotionBtn.addEventListener('click', () => {
				if (this._emotionKeyboard.style.display === 'block') {
					this._emotionKeyboard.style.display = 'none';
				} else {
					this._emotionKeyboard.style.display = 'block';
				}
				this._text.focus();
			});
		}

		for (let i = 0; i < this._smiles.length; i++) {
			this._smiles[i].addEventListener('click', () => {
				const smile = this._smiles[i].innerText || this._smiles[i].textContent;
				this._text.value += smile;
				this._text.focus();
      });
    }

    for (let i = 0; i < this._install.length; i++) {
			this._install[i].addEventListener('click', () => {
				const url = this._install[i].getAttribute("data-id");
				window.open(url, '_blank');
			});
		}
	}

	showPage(search) {
		if (search.link) {
			this._groupLink = search.link;
			actionUser.getProfile(() => { actionGroups.getGroupInfo(() => { actionPost.getPostsByCommunity(this._groupLink, this._postsBatchSize); actionGroups.getGroupsSub(this._groupLink, 3); }, this._groupLink); });
		} else {
			Router.go('/groups', false);
		}
	}


	_preRender() {
		this.watingForNewPosts = false;

		this._template = Handlebars.templates.group;
		let header = headerConst;
		header['avatar_url'] = userStore.user.avatar_url;

		for (let i = 0; i < postsStore.posts.length; ++i) {
			postsStore.posts[i].comments = postsStore.comments.get(postsStore.posts[i].id);
			postsStore.posts[i].has_next = postsStore.haveCommentsContinuation.get(postsStore.posts[i].id);
		}

		this._context = {
			sideBarData: sideBarConst,
			headerData: header,

			groupData: groupsStore.curGroup,

			postAreaData: {
				createPostData: {
					displayNone: !groupsStore.curGroup.isAdmin,
					isCreate: this.isCreate,
					isEdit: this.isEdit,
					avatar_url: groupsStore.curGroup.avatar_url,
					jsId: 'js-create-post',
					create: { avatar_url: groupsStore.curGroup.avatar_url, attachments: postsStore.attachments , text: postsStore.text, buttonData: { text: 'Опубликовать', jsId: 'js-create-post-btn' }, keyboardData: {smiles: emotionKeyboard},}
				},
				postList: postsStore.posts},
		}
		postsStore.text = '';

		if (this._context.postAreaData.createPostData.isEdit) {
			this._context.postAreaData.createPostData.create.text = postsStore.curPost.text_content;
			this._context.postAreaData.createPostData.create.id = postsStore.curPost.id;
			this._context.postAreaData.createPostData.create.attachments= postsStore.curPost.attachments;
			this._context.postAreaData.createPostData.create.buttonData = { text: 'Изменить', jsId: 'js-edit-post-btn'};
		}
	}
}
