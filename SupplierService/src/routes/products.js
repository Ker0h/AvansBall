const express = require("express")
const router = express.Router()
const amqpUtils = require('../utils/amqp.util')
const SupplierProductCreated = require('../events/SupplierProductCreated')
const SupplierProductUpdated = require('../events/SupplierProductUpdated')
const ProductWriteRepository = require('../dataAccess/ProductWriteRepository')
const ProductReadRepository = require('../dataAccess/ProductReadRepository')
const SupplierProductDeleted = require("../events/SupplierProductDeleted")

/**
 * HTTP GET
 * DB: READ
 * Gets all the products from the read database.
 */
router.get('/', (req, res) => {
    ProductReadRepository.getAllProducts()
        .then((repoObject) => res.status(repoObject.status).json(repoObject))
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
});

/**
 * HTTP POST
 * DB: WRITE
 * Create a supplier product. After the product is created the product is sent to the message bus with event ProductCreated.
 */
router.post('/', (req, res) => {
    const title = req.body.title || ''
    const price = req.body.price || 0
    const category = req.body.category || ''

    ProductWriteRepository.createProduct(title, price, category)
        .then((repoObject) => {
            amqpUtils.sendToBus(
                new SupplierProductCreated(repoObject.product._id, repoObject.product.title, repoObject.product.price, repoObject.product.category)
            )
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

/**
 * HTTP PUT
 * DB: WRITE
 * Update a single product in the write database. After update is completed, sent product on message bus with event ProductUpdated.
 */
router.put('/:id', (req, res) => {
    const productId = req.params.id || ''
    const title = req.body.title || ''
    const price = req.body.price || 0
    const category = req.body.category || ''

    ProductWriteRepository.updateProduct(productId, title, price, category)
        .then((repoObject) => {
            amqpUtils.sendToBus(new SupplierProductUpdated(productId, title, price, category))
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

router.delete('/:id', (req, res) => {
    const productId = req.params.id || ''

    ProductWriteRepository.deleteProduct(productId)
        .then((repoObject) => {
            amqpUtils.sendToBus(new SupplierProductDeleted(productId))
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

module.exports = router