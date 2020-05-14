const mongoose = require('mongoose');
const readDb = require('../dbConnection/readConnection').connectionFactory()
const Schema = mongoose.Schema;

const ProductReadSchema = new Schema({
    title: String,
    category: String,
    price: Number
})

const ProductRead = readDb.model('productRead', ProductReadSchema)

module.exports = ProductRead