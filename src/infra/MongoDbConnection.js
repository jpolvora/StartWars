import { MongoClient } from 'mongodb'

export class MongoDbAdapter {
  constructor(uri, dbName) {
    const client = new MongoClient(uri)
    this.client = client
    this.db = client.db(dbName)
  }

  async connect() {
    await this.client.connect()
    await this.db.command({ ping: 1 })
  }

  async disconnect() {
    await this.client.close()
  }

  getDb() {
    return this.db
  }
}
