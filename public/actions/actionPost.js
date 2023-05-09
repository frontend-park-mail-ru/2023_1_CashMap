import Dispatcher from "../dispatcher/dispatcher.js";

/**
 * action-ы для работы с постами 
 */
export const actionPost = {
    /**
     * action для получения списка постов пользователя
     * @param {*} userLink - ссылка пользователя
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsByUser(userLink, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getPosts',
            userLink,
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения списка постов друзей пользователя
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getFriendsPosts(count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getFriendsPosts',
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения постов по id 
     * @param {*} id - id постов
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsById(id, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getPostById',
            id,
            count,
            lastPostDate,
        });
    },
    /**
     * action для получения списка постов сообщества
     * @param {*} community_link - ссылка на сообщество
     * @param {*} count - количество получаемых постов
     * @param {*} lastPostDate - дата, после которой выбираются посты
     */
    getPostsByCommunity(community_link, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getPostsByCommunity',
            community_link,
            count,
            lastPostDate,
        });
    },
    /**
     * action для удаления поста
     * @param {*} postId - id поста
     */
    deletePost(postId) {
        Dispatcher.dispatch({
            actionName: 'deletePost',
            postId,
        });
    },
    /**
     * action для создания поста на странице пользователя
     * @param {*} author_link - ссылка на автора поста
     * @param {*} owner_link - ссылка на страницу пользователя, у которого на странице будет пост
     * @param {*} show_author - показывать ли автора поста
     * @param {*} text - текст поста
     */
    createPostUser(author_link, owner_link, show_author, text) {
        Dispatcher.dispatch({
            actionName: 'createPost',
            data: {
                author_link,
                owner_link,
                show_author,
                text,
            },
        });
    },
    /**
     * action для создания поста на странице сообщества
     * @param {*} author_link - ссылка на автора поста
     * @param {*} community_link - ссылка на сообщество, где будет пост
     * @param {*} show_author - показывать ли автора поста
     * @param {*} text - текст поста
     */
    createPostCommunity(author_link, community_link, show_author, text) {
        Dispatcher.dispatch({
            actionName: 'createPost',
            data: {
                author_link,
                community_link,
                show_author,
                text
            },
        });
    },
    /**
     * action для изменения поста
     * @param {*} text - текст поста
     * @param {*} postId - id поста
     */
    editPost(text, postId) {
        Dispatcher.dispatch({
            actionName: 'editPost',
            text,
            postId,
        });
    },
    /**
     * action для лайка поста
     * @param {*} postId - id поста
     */
    likePost(postId) {
        Dispatcher.dispatch({
            actionName: 'likePost',
            postId,
        });
    },
    /**
     * action для дизлайка поста
     * @param {*} postId - id поста
     */
    dislikePost(postId) {
        Dispatcher.dispatch({
            actionName: 'dislikePost',
            postId,
        });
    },
};
