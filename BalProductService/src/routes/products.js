const express = require("express")
const router = express.Router()
const amqpUtils = require('../utils/amqp.util')

const ProductWriteRepository = require('../dataAccess/ProductWriteRepository')
const ProductReadRepository = require('../dataAccess/ProductReadRepository')

const BalProductCreated = require('../events/BalProductCreated')
const BalProductUpdated = require('../events/BalProductUpdated')
const BalProductDeleted = require("../events/BalProductDeleted")
const BalProductTitleUpdated = require("../events/BalProductTitleUpdated")
const BalProductCategoryUpdated = require("../events/BalProductCategoryUpdated")
const BalProductPriceUpdated = require("../events/BalProductPriceUpdated")

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
 * Create a product. After the product is created the product is sent to the message bus with event ProductCreated.
 */
router.post('/', (req, res) => {
    const title = req.body.title || ''
    const price = req.body.price || 0
    const category = req.body.category || ''
    const isSupplierProduct = false
    const supplier = "Bal"

    ProductWriteRepository.createProduct(title, price, category, isSupplierProduct, supplier)
        .then((repoObject) => {
            amqpUtils.sendToBus(
                new BalProductCreated(repoObject.product._id, repoObject.product.title, repoObject.product.price, repoObject.product.category, repoObject.product.isSupplierProduct, repoObject.product.supplier)
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
            amqpUtils.sendToBus(new BalProductUpdated(productId, title, price, category))
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

router.patch('/:id/title', (req, res) => {
    const productId = req.params.id || ''
    const title = req.body.title || ''

    ProductWriteRepository.updateProductTitle(productId, title)
        .then((repoObject) => {
            amqpUtils.sendToBus(
                new BalProductTitleUpdated(productId, title)
            )
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

router.patch('/:id/category', (req, res) => {
    const productId = req.params.id || ''
    const category = req.body.category || ''

    ProductWriteRepository.updateProductCategory(productId, category)
        .then((repoObject) => {
            amqpUtils.sendToBus(
                new BalProductCategoryUpdated(productId, category)
            )
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

router.patch('/:id/price', (req, res) => {
    const productId = req.params.id || ''
    const price = req.body.price || ''

    ProductWriteRepository.updateProductPrice(productId, price)
        .then((repoObject) => {
            amqpUtils.sendToBus(
                new BalProductPriceUpdated(productId, price)
            )
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

router.delete('/:id', (req, res) => {
    const productId = req.params.id || ''

    ProductWriteRepository.deleteProduct(productId)
        .then((repoObject) => {
            amqpUtils.sendToBus(new BalProductDeleted(productId))
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => res.status(repoObject.status).json(repoObject))
})

module.exports = router