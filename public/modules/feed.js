import Ajax from "./ajax.js";
import goToPage from "./goToPage.js";
import {config} from "./goToPage.js";

export default class FeedController {

	#mainElement

	constructor(mainElement) {
		this.#mainElement = mainElement;
	}

	setup() {
		const exitItem = this.#mainElement.querySelector('.header-dropdown-menu .exit');
		exitItem.addEventListener('click', () => {
			const request = Ajax.post('/auth/logout');
			request
				.then((response) => {
					goToPage(config.login);
				})
				.catch((response) => {
					alert(response.message)
				})
		})
	}

}
