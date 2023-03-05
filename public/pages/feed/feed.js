import Ajax from "../../modules/ajax.js";
import Header from "../../components/header/header.js";

export default class Feed {

    constructor(parent) {
        this.parent = parent;
        this.childElemnts = [];
        this.selfElement = parent.createElement('div')
        this.selfElement.setAttribute('class', 'main')

    }

    render() {
        this.childElemnts.forEach((el) => el.render());
    }

    remove() {

    }

    setup() {
        // TODO добавить компонент сайдбар
        // TODO добавить компонент поиск
        const header = new Header(this.selfElement, {});
        this.childElemnts.push(header);
        // TODO добавить компонент создание поста

        this.posts = []
        const request = Ajax.get('http://95.163.212.121:8080/api/feed');
        request
            .then( response => {
                if (response.status < 300) {
                    this.posts = response.response.posts
                    return
                }
                // TODO обработать код ответа
            })
            .catch(response =>{
                // TODO обработать ошибку
                console.log(response)

            })

        this.posts.forEach(post => {
            // TODO добавить компоненты пост
        })
    }
}