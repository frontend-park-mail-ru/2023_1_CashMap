const AJAX_METHOD_TYPES = {
    GET: 'GET',
    POST: 'POST',
}

export default class Ajax {

    static async get(params = {}) {
        const response = await fetch(params.url, {
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
            response: body,
        }
    };

    static async post(params = {}) {
        const response = await fetch(params.url, {
            method: AJAX_METHOD_TYPES.POST,
            mode: "cors",
            credentials: "include",
            headers: {
                Origin: this.FrontendHost,
            },
            body: params.body,
        });
        return {
            status: response.status,
        }
    }
};