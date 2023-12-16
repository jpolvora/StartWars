export class GetSingle {
  constructor(container) {
    this.personagens = container.personagens
  }

  async execute(input) {
    const result = await this.personagens.getById(input)

    return result
  }
}
