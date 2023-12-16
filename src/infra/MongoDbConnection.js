import { MongoClient, ServerApiVersion } from 'mongodb'

export default class MongoDbConnection {
  constructor(uri) {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri)

    this.client = client
  }

  getClient() {
    return this.client.db('startwars')
  }
}
