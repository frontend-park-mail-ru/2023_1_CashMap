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
        this.currentPage?.remove();

        if (this._pages[url]) {
            this.currentPage = this._pages[url];
            this.currentPage.render();

            if (window.location.pathname + window.location.search !== url) {
                window.history.replaceState(null, null, url);
            }

        } else {
            alert('page not found');
        }
    }

    init() {
        this.go(window.location.pathname + window.location.search);
    }
}

export default new Router();
