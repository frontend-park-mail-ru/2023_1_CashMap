export default class Post {
  #config
  #parent

  constructor (parent, postData, staticPaths) {
    this.#parent = parent

    this.#config = {
      post: postData,
      paths: staticPaths
    }
  }

  render () {
    const template = Handlebars.templates.post

    const post = document.createElement('div')
    post.classList.add('post')
    post.innerHTML += template(this.#config)
    this.#parent.appendChild(post)

    return post
  }
}
