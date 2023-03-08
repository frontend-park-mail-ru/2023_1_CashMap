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
					if (response.status < 300) {
						goToPage(config.login);
						return;
					} 

					throw response
				})
				.catch((response) => {
					console.log(12312312);
					alert("Unsuccessfully exited. code=", response.status);
				})
		})
	}

}