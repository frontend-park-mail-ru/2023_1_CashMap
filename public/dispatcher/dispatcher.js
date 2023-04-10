class Dispatcher {
    constructor() {
        this._callbacks = [];
        this._isDispatching = false;
        this._pendingPayload = null;
    }

    register(callback) {
<<<<<<< HEAD
        console.log('register');
        console.log(this._callbacks);
=======
>>>>>>> main
        this._callbacks.push(callback);
    }

    unregister(id) {
        delete this._callbacks[id];
    }

    dispatch(payload) {
        if (this._isDispatching) {
            throw new Error("Cannot dispatch in the middle of a dispatch");
        }
        this._isDispatching = true;
        this._pendingPayload = payload;
        try {
            this._callbacks.forEach((callback) => {
                if (callback) {
                    callback(this._pendingPayload);
                }
            });
        } finally {
            this._pendingPayload = null;
            this._isDispatching = false;
        }
    }
}

export default new Dispatcher();
