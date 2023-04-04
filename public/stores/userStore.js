import Dispatcher from '../dispatcher/dispatcher.js';

class userStore {
    constructor() {
        this._user = {
            isAuth: false,

            link: null,
            firstName: null,
            lastName: null,
            email: null,
        };

        Dispatcher.register(this.invokeOnDispatch.bind(this));
    }

    async invokeOnDispatch(payload) {
        await this._fromDispatch(payload);
    }

    async _fromDispatch(action) {
        switch (action.actionName) {
            case 'signIn':
                await this._signIn(action.text);
                break;
            case 'signUp':
                await this._signUp();
                break;
            default:
                return;
        }
    }

    async _signIn() {

    }

    async _signUp() {

    }

}

export default new userStore();
