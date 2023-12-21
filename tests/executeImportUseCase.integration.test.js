import 'dotenv/config'
import { getContainer } from './mockedContainer.js'
import { ExecuteImportUseCase } from '../src/application/useCases/ExecuteImportUseCase.js'
import { randomUUID } from 'crypto'

describe('ExecuteImportUseCase Integration Tests', () => {
  it('should execute import', async () => {
    const container = getContainer()
    const sut = new ExecuteImportUseCase(container)
    const output = await sut.execute({
      next: 'next-url',
      uuid: randomUUID(),
    })

    console.log(output)
  })

  it('should execute use case but not import', async () => {
    const container = getContainer()
    const sut = new ExecuteImportUseCase(container)
    const output = await sut.execute({
      next: false,
      uuid: randomUUID(),
    })

    console.log(output)
  })
})
