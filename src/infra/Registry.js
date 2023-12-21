export class Registry {
  #dependencies = {}
  #protected = false

  constructor() {
    this.#protected = false
  }

  //static instance = new Registry()

  set(key, value) {
    if (this.#protected) throw new Error('Container cannot be changed after built')
    this.#dependencies[key] = value

    return this
  }

  get(key) {
    const dependency = this.#dependencies[key]
    if (!dependency) throw new Error(`Dependency not found: ${key}`)
    return dependency
  }

  build() {
    this.#protected = true
    return this
  }
}
