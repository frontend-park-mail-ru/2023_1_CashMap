export default class SideBar {

	#config
	#parent

	constructor(parent, logoTitle, logoPath, itemsList) {
		this.#parent = parent;

		this.#config = {
			logoTitle,
			logoPath,
			itemsList
		};
	}

	render() {
		const sideBar = document.createElement('div');
		sideBar.classList.add('side-bar');

		const template = Handlebars.templates.sidebar;

		sideBar.innerHTML = template(this.#config);

		this.#parent.appendChild(sideBar);
	}

}