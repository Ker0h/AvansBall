const routes = require('express').Router();
const controller = require('../controllers/stock.controller');

routes.get('/', controller.getStock);
routes.get('/:name', controller.getStockByName);
routes.post('/', controller.addProduct);
routes.put('/', controller.updateProduct);
routes.delete('/', controller.deleteProduct);
routes.patch('/increaseAmount', controller.increaseProductAmount);
routes.patch('/decreaseAmount', controller.decreaseProductAmount);
routes.patch('/changeProductName', controller.changeProductName);
routes.patch('/changeProductCategory', controller.changeProductCategory);
routes.patch('/changeProductPrice', controller.changeProductPrice);

module.exports = routes;
