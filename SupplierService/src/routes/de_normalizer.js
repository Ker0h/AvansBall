const amqp = require('amqplib/callback_api');
const ProductReadRepository = require('../dataAccess/ProductReadRepository')

class DeNormalizer {
    listen() {
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
                    console.log(" [x] Received %s", JSON.parse(message.content).Event);


                }, {
                    noAck: true
                });
            })
        })
    }
}

module.exports = DeNormalizer