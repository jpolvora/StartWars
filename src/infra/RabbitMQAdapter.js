import amqp from 'amqplib'

export default class RabbitMQAdapter {
  constructor(url) {
    this.url = url
  }

  connection

  async connect() {
    this.connection = await amqp.connect(this.url)
  }

  async disconnect() {
    await this.connection.close()
  }

  async consume(queueName, callback) {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queueName, { durable: true })
    channel.consume(queueName, async (msg) => {
      const input = JSON.parse(msg.content.toString())
      await callback(input)
      channel.ack(msg)
    })
  }

  async publish(queueName, data) {
    const channel = await this.connection.createChannel()
    await channel.assertQueue(queueName, { durable: true })
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))
  }
}
