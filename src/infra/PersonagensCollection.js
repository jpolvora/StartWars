export class PersonagensCollection {
  constructor(db) {
    this.personagens = db.collection('personagens')
  }

  async saveAllAsync(people) {
    //format object to the bulkWrite shape

    function wrap(pessoa) {
      const upsertModel = {
        updateOne: {
          filter: { _id: pessoa.id },
          upsert: true,
          update: {
            $set: {
              _id: pessoa.id,
              nome: pessoa.nome,
              altura: pessoa.altura,
              genero: pessoa.genero,
            },
          },
        },
      }

      return upsertModel
    }

    const bulkData = people.map(wrap)

    await this.personagens.bulkWrite(bulkData, {
      ordered: false,
    })
  }
}
