const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config.json')
const app = express()
const amqpUtils = require('./src/utils/amqp.util')
mongoose.set('useFindAndModify', false)

// Returns middleware that only parses urlencode bodies.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Returns middleware that only parses json,
// and only looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.json());

app.use('/api/bal/products', require('./src/routes/products'))

app.listen(config.appPort, () => {
    console.log(' [+] Message: App listening on: ' + config.appHost + ':' + config.appPort)
})

amqpUtils.listenToBus()

module.exports = app