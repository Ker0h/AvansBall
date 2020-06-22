const mongoose = require('mongoose');
const readDb = require('../dbConnection/readConnection').connectionFactory()
const Schema = mongoose.Schema;

const ProductReadSchema = new Schema({
    productId: String,
    title: String,
    category: String,
    price: Number
})

const ProductRead = readDb.model('product_read', ProductReadSchema)

module.exports = ProductRead