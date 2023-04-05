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
            feed: '/api/feed',
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

    async check() {
        return this._request(this._apiUrl.check, this._requestType.GET);
    }

    async getPosts(count) {
        return this._request(this._apiUrl.feed + `?batch_size=${count}`, this._requestType.GET);
    }




    static async get(url) {
        const response = await fetch(URL+url, {
            method: AJAX_METHOD_TYPES.GET,
            mode: "cors",
            credentials: "include",
            headers: {
                Origin: this.FrontendHost,
            },
        });

        const body = await response.json();

        return {
            status: response.status,
            message: response.statusText,
            body: body.body,
        }
    }

    static async get_c(url) {
        const response = await fetch(URL+url, {
            method: AJAX_METHOD_TYPES.GET,
            mode: "cors",
            credentials: "include",
            headers: {
                Origin: this.FrontendHost,
            },
        });

        //const body = await response.json();

        return {
            status: response.status,
            message: response.statusText,
            body: response,
        }
    }

    static async post(url, body) {
        const response = await fetch(URL+url, {
            method: AJAX_METHOD_TYPES.POST,
            mode: "cors",
            credentials: "include",
            headers: {
                Origin: this.FrontendHost,
            },
            body: JSON.stringify({body} ),
        });
        return {
            status: response.status,
            message: response.statusText,
            body: response.body,
        }
    }
}

export default new Ajax();
