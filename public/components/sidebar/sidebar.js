export class SideBar {

	#config
	#parent

	constructor(parent, logoText, logoPath, itemsList) {
		this.#parent = parent;

		this.#config = {
			logoText: logoText,
			logoPath: logoPath,
			itemsList: itemsList
		};
	}

	render() {
		const sideBar = document.createElement('div');
		sideBar.class = 'side-bar';

		template = Handlebars.template.sidebar;

		sideBar.innerHTML = template(this.#config);

		sideBar.#parent.appendChild(sideBar)
	}

}



itemsList: {
				{
					ref: '/profile',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Моя страница',
					notifies: 0
				},

				{
					ref: '/feed',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Новости',
					notifies: 0
				},

				{
					ref: '/msg',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Мессенджер',
					notifies: 0
				},

				{
					ref: '/albums',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Фотографии',
					notifies: 0
				},

				{
					ref: '/friends',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Друзья',
					notifies: 0
				},

				{
					ref: '/groups',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Сообщества',
					notifies: 0
				},

				{
					ref: '/bookmarks',
					iconPath: '',
					hoveredIconPath: '',
					title: 'Закладки',
					notifies: 0
				}
			}