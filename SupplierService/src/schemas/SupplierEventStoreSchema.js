const mongoose = require('mongoose');
const eventStoreConnection = require('../dbConnection/eventStoreConnection').connectionFactory()
const ProductReadSchema = require('./ProductReadSchema');
const ProductRead = require('./ProductReadSchema');
const Schema = mongoose.Schema;

const SupplierEventStoreSchema = new Schema({
    event: String,
    data: ProductReadSchema.ProductReadSchema,
    timestamp: String
})

const SupplierEventStore = eventStoreConnection.model('supplier_event_store', SupplierEventStoreSchema)

module.exports = SupplierEventStore