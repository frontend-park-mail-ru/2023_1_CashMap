export default class Feed {
  #config
  #parent

  constructor (parent, posts) {
    this.#parent = parent

    this.#config = {
      posts
    }
  }

  render () {
    const template = Handlebars.templates.feed

    this.#parent.innerHTML = template(this.#config)
  }
}
