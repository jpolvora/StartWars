export class Registry {
  #dependencies = {}
  #protected = false

  constructor() {}

  static instance = new Registry()

  set(key, value) {
    if (this.#protected) return
    this.#dependencies[key] = value
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
