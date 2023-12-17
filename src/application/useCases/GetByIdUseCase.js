export class GetByIdUseCase {
  constructor(personagens) {
    this.personagens = personagens
  }

  async execute(input) {
    const result = await this.personagens.getById(input)

    return result
  }
}
