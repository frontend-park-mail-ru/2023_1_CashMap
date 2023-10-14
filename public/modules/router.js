/**
 * класс роутера, который отсеживает переход по url, и вызывает соответствующие им view
 */
class Router {
    /**
     * @constructor
     * конструктор метода
     */
    constructor() {
        this.currentPage = null;
        this._pages = {};
        this.rootElement = document.getElementById('root');
    }

    /**
     * метод для регистрации шаблона url
     * @param {string} url - url
     * @param {BaseView} view - view url
     */
    registerPage(url, view) {
        this._pages[url] = view;
    }

    /**
     * метод, выполняющий переход по относительному url
     * @param {String} winUrl - url на который следует перейти
     * @param {Boolean} replace - true: заменить текущую запись, false: добавить новую
     * (по умолчанию: false)
     */
    go(winUrl, replace = true) {
        const url = this._getUrl(winUrl);
        const search = this._getSearch(winUrl);
        if (this.currentPage) {
            this.currentPage.remove();
            this.currentPage.curPage = false;
        }



        if (this._pages[url]) {
            this.currentPage = this._pages[url];
            this.currentPage.curPage = true;
            this.currentPage.showPage(search);

            if (window.location.pathname + window.location.search !== winUrl) {
                if (replace) {
                    window.history.replaceState(null, null, winUrl);
                } else {
                    window.history.pushState(null, null, winUrl);
                }
            }

        } else {
            this._pages['/404'].showPage();
        }
    }

    /**
     * метод, осуществляющий переход на предыдущую страницу
     */
    goBack() {
        window.history.back();
    }

    /**
     * метод инициализации
     */
    init() {
        this.go(window.location.pathname + window.location.search, true);

        window.addEventListener("popstate", () => {
            this.go(window.location.pathname + window.location.search, false);
        });
    }

    _getUrl(url) {
        const urlObject = new URL(url, window.location.origin);
        return urlObject.pathname === '/' ? '/' : urlObject.pathname.replace(/\/$/, '');
    }

    _getSearch(url) {
        const urlObject = new URL(url, window.location.origin);
        return Object.fromEntries(urlObject.searchParams);
    }
}

export default new Router();
