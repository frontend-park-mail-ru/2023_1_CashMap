const URL = "http://127.0.0.1:8080";

const AJAX_METHOD_TYPES = {
    GET: 'GET',
    POST: 'POST',
}

export default class Ajax {
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

};