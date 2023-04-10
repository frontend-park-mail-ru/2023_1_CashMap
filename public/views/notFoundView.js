import userStore from "../stores/userStore.js";
import Router from "../modules/router.js";

export default class NotFoundView {
	constructor() {
		this._addHandlebarsPartial();

		this._jsId = 'not-found';
		this.curPage = false;
	}

	_addHandlebarsPartial() {
        Handlebars.registerPartial('notFound', Handlebars.templates.notFound)
	}

	remove() {
		document.getElementById(this._jsId)?.remove();
	}

	showPage() {
		this._render();
	}

	_preRender() {
		this._context = {
			code: '404',
			text: 'Страница не найдена',
		}
	}

	_render() {
		this._preRender();
		this._template = Handlebars.templates.notFound;
		Router.rootElement.innerHTML = this._template(this._context);
	}
}
