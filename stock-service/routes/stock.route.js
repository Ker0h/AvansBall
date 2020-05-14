const routes = require('express').Router();
const controller = require('../controllers/stock.controller');

routes.get('/', controller.getStock);
routes.get('/:name', controller.getStockByName);
routes.post('/', controller.addProduct);
routes.put('/:name', controller.updateProduct)
routes.delete('/:name', controller.deleteProduct)

module.exports = routes;
