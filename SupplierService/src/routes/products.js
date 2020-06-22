const express = require("express");
const router = express.Router();
const amqp = require('amqplib/callback_api')
const amqpUtils = require('../utils/amqp.util')
const SupplierProductCreated = require('../events/ProductCreated')
const SupplierProductUpdated = require('../events/ProductUpdated')
const ProductWriteRepository = require('../dataAccess/ProductWriteRepository');
const ProductReadRepository = require('../dataAccess/ProductReadRepository');

// router.get('/', (req, res) => {
//     ProductReadRepository.getAllProducts()
//         .then((repoObject) => {
//             res.status(repoObject.status).json(repoObject);
//         })
//         .catch((repoObject) => {
//             res.status(repoObject.status).json(repoObject);
//         });
// });

router.post('/', (req, res) => {
    const title = req.body.title || ''
    const price = req.body.price || ''
    const category = req.body.category || ''

    ProductWriteRepository.createProduct(title, price, category)
        .then((repoObject) => {
            console.log("In then")
            console.log(repoObject)
            var supplierProduct = new SupplierProductCreated(repoObject.product._id, repoObject.product.title, repoObject.product.price, repoObject.product.category)
            amqpUtils.sendToBus(supplierProduct)
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => {
            console.log("In error")
            console.log(repoObject)
            res.status(repoObject.status).json(repoObject)
        })
})

router.put('/:id', (req, res) => {
    const productId = req.params.id || ''
    const title = req.body.title || ''
    const price = req.body.price || ''
    const category = req.body.category || ''

    ProductWriteRepository.updateProduct(productId, title, price, category)
        .then((repoObject) => {
            console.log(repoObject.product)
            var supplierProduct = new SupplierProductUpdated(reqoObject.product._id, repoObject.product.title, repoObject.product.price, repoObject.product.category)
            amqpUtils.sendToBus(supplierProduct)
            res.status(repoObject.status).json(repoObject)
        })
        .catch((repoObject) => {
            res.status(repoObject.status).json(repoObject)
        })
})

module.exports = router