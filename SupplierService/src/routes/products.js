const express = require("express");
const router = express.Router();
const amqp = require('amqplib/callback_api')
const SupplierProductCreated = require('../events/ProductCreated')
const ProductWriteRepository = require('../dataAccess/ProductWriteRepository');
const ProductWriteRepository = require('../dataAccess/ProductReadRepository');

router.get('/', (req, res) => {
    ProductReadRepository.getAllProducts()
        .then((repoObject) => {
            res.status(repoObject.status).json(repoObject);
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject);
        });
});

router.post('/', (req, res) => {
    const title = req.body.title || ''
    const price = req.body.price || ''
    const category = req.body.category || ''

    var supplierProduct = new SupplierProductCreated(title, price, category)

    ProductWriteRepository.createProduct(title, price, category)
        .then((repoObject) => {
            // Yeet object to RabbitMQ bus.
            amqp.connect('amqp://localhost', (err, connection) => {
                if (err) console.warn(err)

                connection.createChannel((channelError, channel) => {
                    if (channelError) console.log(channelError)

                    let queueName = "supplierProducts"
                    let message = {
                        "Event": supplierProduct.constructor.name,
                        "SupplierProduct": supplierProduct
                    }
                    channel.assertQueue(queueName, {
                        durable: false
                    })

                    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
                    console.log(" [x] Sent %s", message);
                })

                setTimeout(function () {
                    connection.close();
                }, 500);
            })

            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject)
        })
})

module.exports = router