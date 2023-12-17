export class GetAllUseCase {
  constructor(personagens) {
    this.personagens = personagens
  }

  async execute() {
    const result = await this.personagens.getAll()

    return result
  }
}
