export default class Signup {
  #config
  #parent

  constructor (parent, picPath, fonPath) {
    this.#parent = parent

    this.#config = {
      picPath,
      fonPath
    }
  }

  render () {
    const template = Handlebars.templates.signup
    this.#parent.innerHTML = template(this.#config)
  }
}
