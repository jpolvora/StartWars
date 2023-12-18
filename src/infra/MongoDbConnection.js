import { MongoClient } from 'mongodb'

export class MongoDbAdapter {
  constructor(uri, dbName) {
    const client = new MongoClient(uri)
    this.client = client
    this.db = client.db(dbName)
  }

  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Connected to mongodb')
    } catch (e) {
      console.error('Erro ao conectar no banco de dados: ' + e)
      throw e
    }
  }

  async disconnect() {
    await this.client.close()
    console.log('gracefully shutdown mongodb connection')
  }

  getDb() {
    return this.db
  }
}
