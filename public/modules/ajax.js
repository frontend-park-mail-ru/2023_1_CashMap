const AJAX_METHOD_TYPES = {
    GET: 'GET',
    POST: 'POST',
}

export default class Ajax {

    static async get(params = {}) {
       const response = await fetch(params.url, {
            method: AJAX_METHOD_TYPES.GET,
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
        });
        return {
            status: response.status,
        }
    }
}