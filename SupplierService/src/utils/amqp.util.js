const amqp = require('amqplib/callback_api')
const DeNormalizer = require('../routes/de_normalizer')
const config = require('../../config.json')

class AmqpUtil {

    static sendToBus(supplierProduct) {
        amqp.connect(config.rabbitMqUrl, (err, connection) => {
            if (err) console.warn(err)

            connection.createChannel((channelError, channel) => {
                if (channelError) console.log(channelError)

                let exchange = 'supplierService'

                channel.assertExchange(exchange, 'fanout', { durable: false })

                let message = {
                    "event": supplierProduct.constructor.name,
                    "supplierProduct": supplierProduct
                }

                channel.publish(exchange, '', Buffer.from(JSON.stringify(message)))
                console.log(" [x] Sent %s", message.event);
            })

            setTimeout(function () {
                connection.close();
            }, 500);
        })
    }

    static listenToBus() {
        amqp.connect(config.rabbitMqUrl, (err, connection) => {
            if (err) console.warn(err)

            connection.createChannel((channelError, channel) => {
                if (channelError) console.warn(channelError)

                const exchange = 'supplierService'

                channel.assertExchange(exchange, 'fanout', {
                    durable: false
                })

                channel.assertQueue('', {
                    exclusive: true
                }, (err, q) => {
                    if (err) console.warn(err)

                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

                    channel.bindQueue(q.queue, exchange, '')

                    channel.consume(q.queue, (message) => {
                        console.log(" [+] Received: " + JSON.parse(message.content).event)
                        let deNormalizer = new DeNormalizer()
                        deNormalizer.insertIntoRead(JSON.parse(message.content))
                    }, {
                        noAck: true
                    });
                })
            })
        })
    }
}

module.exports = AmqpUtil