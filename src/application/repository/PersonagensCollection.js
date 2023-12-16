export class PersonagensCollection {
  constructor(db) {
    this.db = db
  }

  async write(bulkData) {
    //await this.db.collection('personagens').deleteMany({})

    await this.db.collection('personagens').bulkWrite(bulkData, {
      ordered: false,
    })
  }
}
