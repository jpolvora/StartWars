import { randomUUID } from 'crypto'

export default class Import {
  execute(input) {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve({
          success: true,
          uuid: randomUUID(),
        })
      }, 1000)
    })
  }
}
