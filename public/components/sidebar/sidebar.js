export class SideBar {
	#config
	#parent

	constructor(parent, logoText, logoPath, itemsList) {
		this.#parent = parent;

		this.#config = {
			logoText,
			logoPath,
			itemsList,
		};
	}

	render() {
		const sideBar = document.createElement('div');
		sideBar.class = 'side-bar';

		let template = Handlebars.templates.sidebar;
		sideBar.innerHTML = template(this.#config);

		this.#parent.appendChild(sideBar)
	}
}
