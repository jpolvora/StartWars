import { sleep } from '../src/utils/index.js'

export class MockPersonagens {
  async getById(id) {
    if (id === 99) {
      return undefined
    }

    await sleep(100)
    return {
      id,
      nome: `fake${id}`,
      altura: 100,
      peso: 100,
    }
  }

  async getAll() {
    await sleep(100)
    return [
      {
        id: 1,
        nome: 'fake 1',
        altura: 100,
        peso: 100,
      },
      {
        id: 2,
        nome: 'fake 2',
        altura: 90,
        peso: 110,
      },
    ]
  }

  async saveAllAsync() {
    await sleep(1000)
    return true
  }
}
