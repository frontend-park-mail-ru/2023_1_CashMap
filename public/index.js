import SideBar from './components/sidebar/sidebar.js';
import Post from './components/post/post.js';
import Comment from './components/comment/comment.js';
import Header from "./components/header/header.js";
import CreatePost from "./components/createPost/createPost.js";
import CommentArea from "./components/commentArea/commentArea.js";
import Login from "./components/login/login.js";
import Signup from "./components/signup/signup.js";


import signIn from "./modules/signin.js";
import signUp from "./modules/signup.js";
import Ajax from "./modules/ajax.js";

import {config} from "./modules/goToPage.js";
import goToPage from "./modules/goToPage.js";

goToPage(config.login)


// const commentButton = document.querySelector('.post-comments-icon img');
// commentButton.addEventListener('click', function() {
// 	renderCommentArea()
// })


// function renderCommentArea(parent) {

// }


 /*const request = Ajax.get({url: 'http://95.163.212.121:8080/api/feed/'});

 let posts;

 request
 	.then(response => {
 			if(response.ok){
 				alert("Unauthorized")
 				return
 			}
 			posts = response.response
 		}
 	)
 	.catch( response => {
 			alert(response)
 	})*/





