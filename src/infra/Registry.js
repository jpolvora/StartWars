export class Registry {
  dependencies = {}

  constructor() {}

  static instance = new Registry()

  set(key, value) {
    this.dependencies[key] = value
  }

  get(key) {
    return this.dependencies[key]
  }
}
