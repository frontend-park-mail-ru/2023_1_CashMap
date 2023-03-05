export default class CreatePost {
  #config
  #parent

  constructor (parent) {
    this.#parent = parent
  }

  get config () {
    return this.#config
  }

  set config ({ profileUrl, avatar }) {
    this.#config = {
      profileUrl,
      avatar
    }
  }

  render () {
    const header = document.createElement('div')
    header.classList.add('post-creator')

    const template = Handlebars.templates.createPost
    header.innerHTML = template(this.#config)
    this.#parent.appendChild(header)
  }
}
