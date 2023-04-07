import Dispatcher from "../dispatcher/dispatcher.js";

export const actionPost = {
    getPostsByUser(userLink, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getPosts',
            userLink,
            count,
            lastPostDate,
        });
    },
    getPostsByCommunity(community_link, count, lastPostDate) {
        Dispatcher.dispatch({
            actionName: 'getPosts',
            community_link,
            count,
            lastPostDate,
        });
    },
    deletePost(post_id) {
        Dispatcher.dispatch({
            actionName: 'deletePost',
            post_id,
        });
    },
    createPostUser(author_link, owner_link, show_author, text) {
        Dispatcher.dispatch({
            actionName: 'createPost',
            data: {
                author_link,
                owner_link,
                show_author,
                text
            },
        });
    },
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
    editPost(data) {
        Dispatcher.dispatch({
            actionName: 'editPost',
            data: data,
        });
    },
};
