export class GetList {
  constructor(container) {
    this.personagens = container.personagens
  }

  async execute() {
    const result = await this.personagens.getAll()

    return result
  }
}
