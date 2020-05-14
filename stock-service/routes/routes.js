const routes = require('express').Router();
const stockRoutes = require('./stock.route');

routes.get('/', (req, res) =>
  res.status(200).json({ message: 'Hello World!' })
);

routes.use('/stock', stockRoutes);

routes.use('*', (req, res) =>
  res.status(404).json({ message: 'Not found' }).end()
);

module.exports = routes;
