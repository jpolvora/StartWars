export class GetSingle {
  constructor(container) {
    this.container = container
  }

  async execute(input) {
    return {
      id: input,
    }
  }
}
