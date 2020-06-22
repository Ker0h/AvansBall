const amqp = require('amqplib/callback_api')
const DeNormalizer = require('../routes/de_normalizer')

class AmqpUtil {

    static sendToBus(supplierProduct) {
        amqp.connect('amqp://localhost', (err, connection) => {
            if (err) console.warn(err)

            connection.createChannel((channelError, channel) => {
                if (channelError) console.log(channelError)

                let queueName = "supplierProducts"
                let message = {
                    "event": supplierProduct.constructor.name,
                    "supplierProduct": supplierProduct
                }
                channel.assertQueue(queueName, {
                    durable: false
                })

                channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
                console.log(" [x] Sent %s", message.event);
            })

            setTimeout(function () {
                connection.close();
            }, 500);
        })
    }

    static listenToBus() {
        amqp.connect('amqp://localhost', (err, connection) => {
            if (err) console.warn(err)

            connection.createChannel((channelError, channel) => {
                if (channelError) console.warn(channelError)

                const queueName = "supplierProducts"
                channel.assertQueue(queueName, {
                    durable: false
                })

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
                channel.consume(queueName, (message) => {
                    console.log(" [+] Received: " + JSON.parse(message.content).event)
                    var deNormalizer = new DeNormalizer()
                    deNormalizer.insertIntoRead(JSON.parse(message.content))
                }, {
                    noAck: true
                });
            })
        })
    }
}

module.exports = AmqpUtil