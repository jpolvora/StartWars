export class ManutencaoClearPersonagensUseCase {
  constructor(personagens) {
    this.personagens = personagens
  }

  async execute(id) {
    await this.personagens.clear()
  }
}
