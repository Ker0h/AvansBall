const mongoose = require('mongoose');
const readDb = require('../../utils/readDbConnection').connectionFactory();
const writeDb = require('../../utils/writeDbConnection').connectionFactory();

const { Schema } = mongoose;

const readSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  category: {type: String, required: true},
  price: {type: Number, required: true}
});

const writeSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  category: {type: String, required: true},
  price: {type: Number, required: true},
  isSupplierProduct: { type: Boolean, default: false }
});

const readStock = readDb.model('read', readSchema);
const writeStock = writeDb.model('write', writeSchema);

module.exports = {
  readStock,
  readSchema,
  writeStock,
  writeSchema
};
