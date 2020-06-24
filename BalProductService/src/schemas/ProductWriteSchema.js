const mongoose = require('mongoose')
const writeDb = require('../dbConnection/writeConnection').connectionFactory()
const Schema = mongoose.Schema

const ProductWriteSchema = new Schema({
    title: String,
    category: String,
    price: Number,
    isSupplierProduct: Boolean,
    supplier: String
})

const ProductWrite = writeDb.model('product_write', ProductWriteSchema)

module.exports = ProductWrite