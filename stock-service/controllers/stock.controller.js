const Stock = require('../models/schemas/stock.schema');
const Errors = require('../errorhandling/errorcodes');
const ProductAdded = require('../events/productAdded');
const ProductUpdated = require('../events/productUpdated');
const ProductDeleted = require('../events/productDeleted');
const ProductAmountIncreased = require('../events/productAmountIncreased');
const ProductAmountDecreased = require('../events/productAmountDecreased');
const ProductNameChanged = require('../events/productNameChanged');
const ProductCategoryChanged = require('../events/productCategoryChanged');
const ProductPriceChanged = require('../events/productPriceChanged');

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
  const id = req.body.id || '';
  const name = req.body.name || '';
  const amount = req.body.amount || 0;
  const category = req.body.category || '';
  const price = req.body.price || 0;

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  WriteModel.findByIdAndUpdate(id, { name: name, amount: amount, category: category, price: price },
    (err, stock) => {
      if (err) {
        res.json(err).end()
      } else {
        const productUpdated = new ProductUpdated(id, name, amount, category, price)
        AMQP.sendToBus(productUpdated.constructor.name, productUpdated);

        res.status(204).json(stock).end()
      }
    });
};

const increaseProductAmount = (req, res) => {
  const id = req.body.id || '';
  let amount = req.body.amount || 0;

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  ReadModel.findById(id)
    .then((stock) => {

      WriteModel.findByIdAndUpdate(id, { amount: stock.amount + amount },
        (err, stock) => {
          if (err) {
            res.json(err).end()
          } else {
            const productAmountIncreased = new ProductAmountIncreased(id, amount);
            AMQP.sendToBus(productAmountIncreased.constructor.name, productAmountIncreased);

            res.status(204).json(stock).end()
          }
        });
    })
    .catch((error) => {
      console.log(error)
      const err = Errors.notFound();
      res.status(err.code).json(err).end();
    })
}

const decreaseProductAmount = (req, res) => {
  const id = req.body.id || '';
  let amount = req.body.amount || 0;

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  ReadModel.findById(id)
    .then((stock) => {

      WriteModel.findByIdAndUpdate(id, { amount: stock.amount - amount },
        (err, stock) => {
          if (err) {
            res.json(err).end()
          } else {
            const productAmountDecreased = new ProductAmountDecreased(id, amount);
            AMQP.sendToBus(productAmountDecreased.constructor.name, productAmountDecreased);

            res.status(204).json(stock).end()
          }
        });
    })
    .catch((error) => {
      console.log(error)
      const err = Errors.notFound();
      res.status(err.code).json(err).end();
    })
}

const changeProductName = (req, res) => {
  const id = req.body.id || '';
  const name = req.body.name || '';

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  WriteModel.findByIdAndUpdate(id, { name: name },
    (err, stock) => {
      if (err) {
        res.json(err).end()
      } else {
        const productNameChanged = new ProductNameChanged(id, name);
        AMQP.sendToBus(productNameChanged.constructor.name, productNameChanged);

        res.status(204).json(stock).end()
      }
    })
      .catch((error) => {
        console.log(error)
        const err = Errors.notFound();
        res.status(err.code).json(err).end();
      })
}

const changeProductCategory = (req, res) => {
  const id = req.body.id || '';
  const category = req.body.category || '';

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  WriteModel.findByIdAndUpdate(id, { category: category },
    (err, stock) => {
      if (err) {
        res.json(err).end()
      } else {
        const productcategoryChanged = new ProductCategoryChanged(id, category);
        AMQP.sendToBus(productCategoryChanged.constructor.name, productCategoryChanged);

        res.status(204).json(stock).end()
      }
    })
      .catch((error) => {
        console.log(error)
        const err = Errors.notFound();
        res.status(err.code).json(err).end();
      })
}

const changeProductPrice = (req, res) => {
  const id = req.body.id || '';
  const price = req.body.price || '';

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  }

  WriteModel.findByIdAndUpdate(id, { price: price },
    (err, stock) => {
      if (err) {
        res.json(err).end()
      } else {
        const productPriceChanged = new ProductPriceChanged(id, price);
        AMQP.sendToBus(productPriceChanged.constructor.name, productPriceChanged);

        res.status(204).json(stock).end()
      }
    })
      .catch((error) => {
        console.log(error)
        const err = Errors.notFound();
        res.status(err.code).json(err).end();
      })
}

const deleteProduct = (req, res) => {
  const id = req.body.id || ''

  if (id === '') {
    const err = Errors.PreconditionFailed();
    res.status(err.code).json(err).end();
  };

  WriteModel.findByIdAndDelete(id, (err, stock) => {
    if (err) {
      res.json(err).end()
    } else {
      const productDeleted = new ProductDeleted(id)
      AMQP.sendToBus(productDeleted.constructor.name, productDeleted);

      res.status(204).json(stock).end()
    }
  })
}

module.exports = {
  getStock,
  getStockByName,
  addProduct,
  updateProduct,
  deleteProduct,
  increaseProductAmount,
  decreaseProductAmount,
  changeProductName,
  changeProductCategory,
  changeProductPrice
};
