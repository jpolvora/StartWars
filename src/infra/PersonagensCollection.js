export class PersonagensCollection {
  constructor(db) {
    this.personagens = db.collection('personagens')
  }

  async getById(id) {
    const result = await this.personagens.findOne({ _id: id })
    return result
  }

  async getAll() {
    const result = []
    const cursor = this.personagens.find({}).sort({ nome: 1 })
    for await (const doc of cursor) {
      result.push(doc)
    }

    return result
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
