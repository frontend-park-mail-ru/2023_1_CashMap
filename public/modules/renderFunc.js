import Ajax from "./ajax.js";

import SignUpView from "../views/signUpView.js";
import SignInView from "../views/signInView.js";
import FeedView from "../views/feedView.js";
import goToPage, {config} from "./goToPage.js";


function setup() {
    const exitItem = document.getElementById('js-exit-btn');
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

export function renderFeedPage() {
    const request = Ajax.get('/api/feed?batch_size=10');
    request
        .then(response => {
            if (response.status === 200) {
                const posts = response.body.posts;

                for (let i = 0; i < posts.length; i++) {
                    posts[i].date = (new Date(posts[i].date)).toLocaleDateString('ru-RU', { dateStyle: 'medium' })
                    posts[i].senderPhoto = 'static/img/post_icons/profile_image.svg';
                    posts[i].commentsCount = posts[i].comments.length;

                    for (let j = 0; j < posts[i].comments.length; j++) {
                        posts[i].comments[j].date = (new Date(posts[i].comments[j].date)).toLocaleDateString('ru-RU', { dateStyle: 'medium' })
                        posts[i].comments[j].senderPhoto = 'static/img/post_icons/profile_image.svg';
                    }
                }

                const rootElement = document.getElementById('root');
                const createFeed = new FeedView(rootElement, posts);
                createFeed.render();
                setup();

                let el = document.getElementsByClassName('comment')
                el = Array.prototype.slice.call(el);

                for (let i = 0; i < el.length; i++) {
                    el[i].addEventListener('mouseover', (e) => {
                        e.preventDefault();

                        let elPic = el[i].getElementsByClassName('comment-operations')
                        elPic = Array.prototype.slice.call(elPic)[0];

                        elPic.classList.remove('opacity-pic')
                        console.log(i)
                    });

                    el[i].addEventListener('mouseout', (e) => {
                        e.preventDefault();

                        let elPic = el[i].getElementsByClassName('comment-operations')
                        elPic = Array.prototype.slice.call(elPic)[0];

                        elPic.classList.add('opacity-pic')
                        console.log(i)
                        //comment-edit-block
                    });
                }
                // ToDo: дописать метод для слушанья кнопопк
            } else {
                alert('renderFeedPage not 200');
            }
        })
        .catch(response =>{
            alert('catch renderFeedPage '+ response.message)
        })
}

export function renderSignupPage() {
    const rootElement = document.getElementById('root');
    const createSignup = new SignUpView(rootElement);
    createSignup.render();
}

export function renderLoginPage() {
    const rootElement = document.getElementById('root');
    const createLogin = new SignInView(rootElement);
    createLogin.render();
}
