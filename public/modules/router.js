import {actionUser} from "../actions/actionUser.js";
import userStore from "../stores/userStore.js";

class Router {
    constructor() {
        this.currentPage = null;
        this._pages = {};
        this.rootElement = document.getElementById('root');
    }

    registerPage(url, view) {
        this._pages[url] = view;
    }

    go(url) {
        actionUser.checkAuth();

        if (this.currentPage) {
            this.currentPage.remove();
            this.currentPage.curPage = false;
        }

        if (this._pages[url]) {
            this.currentPage = this._pages[url];
            this.currentPage.curPage = true;
            this.currentPage.updatePage();

            if (window.location.pathname + window.location.search !== url) {
                window.history.replaceState(null, null, url);
            }

        } else {
            alert('page not found');
        }
    }

    goBack() {
        window.history.back();
    }

    init() {
        this.go(window.location.pathname + window.location.search);
    }
}

export default new Router();
