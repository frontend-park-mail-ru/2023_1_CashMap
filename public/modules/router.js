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
            if (this.currentPage.init) {
                this.currentPage.updatePage();
            } else {
                this.currentPage.showPage();
            }

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
        this.go(window.location.pathname + window.location.search, true);
    }

    init() {
        this.go(window.location.pathname + window.location.search);
    }

    freePages() {
        for (let i = 0; i < this._pages.length; i++) {
            this._pages[i].init = false;
        }
    }
}

export default new Router();
