const Stock = require('../models/schemas/stock.schema');
const Errors = require('../errorhandling/errorcodes');
const ProductAdded = require('../events/productAdded');
const ProductUpdated = require('../events/productUpdated');
const ProductDeleted = require('../events/productDeleted')
const AMQP = require('../utils/amqp.util');

const ReadModel = Stock.readStock;
const WriteModel = Stock.writeStock;

const getStock = (req, res) => {
  ReadModel.find({})
    .then((stock) => {
      res.status(200).json(stock).end();
    })
    .catch((err) => {
      const error = Errors.internalServerError();
      res.status(error.code).json(error).end();
    });
};

const getStockByName = (req, res) => {
  const name = req.params.name || '';

  if (name === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  ReadModel.find({ name: name })
    .then((stock) => {
      res.status(200).json(stock).end();
    })
    .catch((error) => {
      const err = Errors.notFound();
      res.status(err.code).json(err).end();
    });
};

const addProduct = (req, res) => {
  const name = req.body.name || '';
  const amount = req.body.amount || 0;
  const category = req.body.category || '';
  const price = req.body.price || 0.0;
  const isSupplierProduct = req.body.supplier || false;

  if (name === '' || category === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  const stock = new WriteModel({
    name,
    amount,
    category,
    price,
    isSupplierProduct
  });

  stock
    .save()
    .then((stock) => {
      const productAdded = new ProductAdded(name, amount, category, price, isSupplierProduct);
      console.log("PRODUCT: " + JSON.stringify(productAdded))
      AMQP.sendToBus(productAdded.constructor.name, productAdded);

      res.status(201).json(stock).end();
    })
    .catch((error) => {
      const err = Errors.internalServerError();
      res.status(err.code).json(error).end();
    });
};

const updateProduct = (req, res) => {
  const name = req.params.name || '';
  const newName = req.body.name || '';
  const amount = req.body.amount || 0;
  const category = req.body.category || '';
  const price = req.body.price || 0;

  if (name === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }  

  WriteModel.findOneAndUpdate({name: name}, 
    {name: newName, amount: amount, category: category, price: price},
    (err, stock) => {
      if (err) {
        res.json(err).end()
    } else {
        const productUpdated = new ProductDeleted(name)
        AMQP.sendToBus(productDeleted.constructor.name, productDeleted);

        res.status(204).json(stock).end()
    }
  });
};

const deleteProduct = (req, res) => {
  const name = req.params.name || ''

  if (name === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  };

  WriteModel.findOneAndDelete({name: name}, 
    (err, stock) => {
    if (err) {
        res.json(err).end()
    } else {
        const productDeleted = new ProductUpdated(name, newName, amount, category, price)
        AMQP.sendToBus(productUpdated.constructor.name, productUpdated);

        res.status(204).json(stock).end()
    }
 
  })
}

module.exports = {
  getStock,
  getStockByName,
  addProduct,
  updateProduct
};
