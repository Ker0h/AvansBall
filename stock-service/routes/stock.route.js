const routes = require('express').Router();
const controller = require('../controllers/stock.controller');

routes.get('/', controller.getStock);
routes.get('/:name', controller.getStockByName);
routes.post('/', controller.addProduct);
routes.put('/', controller.updateProduct)
routes.delete('/', controller.deleteProduct)

module.exports = routes;
