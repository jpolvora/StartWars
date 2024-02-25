import { ServiceBusClient } from '@azure/service-bus'

export class AzureServiceBusConnector {
  constructor(connectionString) {
    if (!connectionString) {
      throw new Error('Service Bus connection string not provided')
    }

    this.serviceBusClient = new ServiceBusClient(connectionString)
  }

  async connect() {
    await Promise.resolve()
  }

  async publish(queueName, messageBody) {
    const sender = this.serviceBusClient.createSender(queueName)
    await sender.sendMessages({ body: messageBody })
    await sender.close()
  }

  async subscribe(queueName) {
    const receiver = this.serviceBusClient.createReceiver(queueName, {
      receiveMode: 'peekLock',
    })

    const messages = await receiver.receiveMessages(1)
    if (messages.length === 0) {
      await receiver.close()
      return null
    }

    const message = messages[0]
    await receiver.completeMessage(message)

    return message.body.toString()
  }

  async close() {
    await this.serviceBusClient.close()
  }
}
