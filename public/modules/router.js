class Router {
    constructor() {
        this.currentPage = null;
        this._pages = {};
        this.rootElement = document.getElementById('root');
    }

    registerPage(url, view) {
        this._pages[url] = view;
    }

    go(url, replace = true) {
        if (this.currentPage) {
            this.currentPage.remove();
            this.currentPage.curPage = false;
        }

        if (this._pages[url]) {
            this.currentPage = this._pages[url];
            this.currentPage.curPage = true;
            this.currentPage.showPage();

            if (window.location.pathname + window.location.search !== url) {
                if (replace) {
                    window.history.replaceState(null, null, url);
                } else {
                    window.history.pushState(null, null, url);
                }
            }

        } else {
            this._pages['/404'].showPage();
        }
    }

    goBack() {
        window.history.back();
    }

    init() {
        this.go(window.location.pathname + window.location.search, true);

        window.addEventListener("popstate", () => {
            this.go(window.location.pathname + window.location.search, false);
        });
    }
}

export default new Router();
