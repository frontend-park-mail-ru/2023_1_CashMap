class Ajax {
    constructor() {
        this._backendUrl = 'http://127.0.0.1';
        //this._backendUrl = 'http://95.163.212.121';
        this._backendPort = '8080';

        this._apiUrl = {
            signIn: '/auth/sign-in',
            signUp: '/auth/sign-up',
            signOut: '/auth/logout',
            check: '/auth/check',
            getProfile: '/api/user/profile',

            feed: '/api/feed',
            userPosts: '/api/posts/profile',
            communityPosts: '/api/posts/community',
            createPost: '/api/posts/create',
            deletePost: '/api/posts/delete',
            editPost: '/api/posts/edit',

            friends: '',
        }

        this._requestType = {
            GET: 'GET',
            POST: 'POST',
            DELETE: 'DELETE',
            PATCH: 'PATCH',
        }
    }

    _request(apiUrlType, requestType, body) {
        const requestUrl = this._backendUrl + ':' + this._backendPort + apiUrlType;
        console.log(requestUrl);

        return fetch(requestUrl, {
            method: requestType,
            mode: "cors",
            credentials: "include",
            headers: {
                Origin: this.FrontendHost,
            },
            body,
        });
    }

    async signIn(email, password) {
        let body = {email: email, password: password};
        return this._request(this._apiUrl.signIn, this._requestType.POST, JSON.stringify({body}));
    }

    async signUp(firstName, lastName, email, password) {
        let body = {first_name: firstName, last_name: lastName, email: email, password: password};
        return this._request(this._apiUrl.signUp, this._requestType.POST, JSON.stringify({body}));
    }

    async signOut() {
        return this._request(this._apiUrl.signOut, this._requestType.POST);
    }

    async getProfile(link) {
        if (link === undefined) {
            return this._request(this._apiUrl.getProfile, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.getProfile + `?link=${link}`, this._requestType.GET);
        }
    }

    async checkAuth() {
        return this._request(this._apiUrl.check, this._requestType.GET);
    }

    async getPosts(userLink, count, lastPostDate) {
        //&last_post_date=${lastPostDate}
        return this._request(this._apiUrl.userPosts + `?owner_link=${userLink}&batch_size=${count}`, this._requestType.GET);
    }

    async createPosts(data) {
        let formData = new FormData();

        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });

        return this._request(this._apiUrl.createPost, this._requestType.POST, formData);
    }

    async getFriends(count, offset) {
        return this._request(this._apiUrl.friends + `?batch_size=${count}&last_post_id=${offset}`, this._requestType.GET);
    }
}

export default new Ajax();
