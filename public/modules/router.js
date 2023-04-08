class Router {
    constructor() {
        this.currentPage = null;
        this._pages = {};
        this.rootElement = document.getElementById('root');
    }

    registerPage(url, view) {
        this._pages[url] = view;
    }

    go(url, replace = true, data = null) {
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
                    window.history.replaceState(data, null, url);
                } else {
                    window.history.pushState(data, null, url);
                }
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

    freePages() {
        for (let i = 0; i < this._pages.length; i++) {
            console.log(this._pages[i].init);
            this._pages[i].init = false;
            console.log(this._pages[i].init);
        }
    }
}

export default new Router();
