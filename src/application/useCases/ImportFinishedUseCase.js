export class ImportFinishedUseCase {
  constructor(container) {
    this.container = container
  }

  execute(msg) {
    console.log('import finished', msg)
  }
}
