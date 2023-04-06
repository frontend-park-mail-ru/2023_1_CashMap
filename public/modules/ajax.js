class Ajax {
    constructor() {
        //this._backendUrl = 'http://127.0.0.1';
        this._backendUrl = 'http://95.163.212.121';
        this._backendPort = '8080';

        this._apiUrl = {
            signIn: '/auth/sign-in',
            signUp: '/auth/sign-up',
            signOut: '/auth/logout',
            check: '/auth/check',
            feed: '/api/feed',
            getUserInfo: '/api/user/profile',
            friends: '',
        }

        this._requestType = {
            GET: 'GET',
            POST: 'POST',
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
            body: body,
        });
    }

    async signIn(email, password) {
        let body = {email: email, password: password};
        return this._request(this._apiUrl.signIn, this._requestType.POST, JSON.stringify({body}));
    }

    async signUp(firstName, lastName, email, password) {
        let body = {email: email, password: password};
        return this._request(this._apiUrl.signUp, this._requestType.POST, JSON.stringify({body}));
    }

    async signOut() {
        return this._request(this._apiUrl.signOut, this._requestType.POST);
    }

    async getUserInfo(link) {
        if (link === undefined) {
            return this._request(this._apiUrl.getUserInfo, this._requestType.GET);
        } else {
            return this._request(this._apiUrl.getUserInfo + `?link=${link}`, this._requestType.GET);
        }
    }

    async checkAuth() {
        return this._request(this._apiUrl.check, this._requestType.GET);
    }

    async getPosts(count, offset) {
        //return this._request(this._apiUrl.feed + `?batch_size=${count}&last_post_id=${offset}`, this._requestType.GET);
        return this._request(this._apiUrl.feed + `?batch_size=${count}`, this._requestType.GET);
    }

    async getFriends(count, offset) {
        return this._request(this._apiUrl.friends + `?batch_size=${count}&last_post_id=${offset}`, this._requestType.GET);
    }
}

export default new Ajax();
