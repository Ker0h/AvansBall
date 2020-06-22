const express = require("express");
const router = express.Router();
const amqpUtils = require('../utils/amqp.util')
const SupplierProductCreated = require('../events/ProductCreated')
const SupplierProductUpdated = require('../events/ProductUpdated')
const ProductWriteRepository = require('../dataAccess/ProductWriteRepository');
const ProductReadRepository = require('../dataAccess/ProductReadRepository');

/**
 * HTTP GET
 * DB: READ
 * Gets all the products from the read database.
 */
router.get('/', (req, res) => {
    ProductReadRepository.getAllProducts()
        .then((repoObject) => {
            res.status(repoObject.status).json(repoObject);
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject);
        });
});

/**
 * HTTP POST
 * DB: WRITE
 * Create a supplier product. After the product is created the product is sent to the message bus with event ProductCreated.
 */
router.post('/', (req, res) => {
    const title = req.body.title || ''
    const price = req.body.price || ''
    const category = req.body.category || ''

    ProductWriteRepository.createProduct(title, price, category)
        .then((repoObject) => {
            var supplierProduct = new SupplierProductCreated(repoObject.product._id, repoObject.product.title, repoObject.product.price, repoObject.product.category)
            amqpUtils.sendToBus(supplierProduct)
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject)
        })
})

/**
 * HTTP PUT
 * DB: WRITE
 * Update a single product in the write database. After update is completed, sent product on message bus with event ProductUpdated.
 */
router.put('/:id', (req, res) => {
    const productId = req.params.id || ''
    const title = req.body.title || ''
    const price = req.body.price || ''
    const category = req.body.category || ''

    ProductWriteRepository.updateProduct(productId, title, price, category)
        .then((repoObject) => {
            var supplierProduct = new SupplierProductUpdated(productId, title, price, category)
            amqpUtils.sendToBus(supplierProduct)
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject)
        })
})

module.exports = router