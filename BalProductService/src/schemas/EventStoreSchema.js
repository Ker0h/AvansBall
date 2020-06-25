const mongoose = require('mongoose');
const eventStoreDB = require('../dbConnection/eventStoreConnection').connectionFactory()
const Schema = mongoose.Schema
const productReadSchema = require('./ProductReadSchema').ProductSchema

const EventStoreSchema = new Schema({
    event: String,
    product: productReadSchema,
    date: Date
})

const EvenStore = eventStoreDB.model('event_store', EventStoreSchema)

module.exports = EvenStore