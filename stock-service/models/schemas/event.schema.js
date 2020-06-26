const mongoose = require('mongoose');
const eventDb = require('../../utils/eventDbConnection').connectionFactory();

const { Schema } = mongoose;

const eventSchema = new Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  productName: { type: String },
  productAmount: { type: Number, default: 0 },
  productCategory: {type: String },
  productPrice: {type: Number }
});

const Event = eventDb.model('event', eventSchema);

module.exports = {
  Event,
  eventSchema
};