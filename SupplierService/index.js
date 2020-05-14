const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config.json')
const app = express()
const DeNormalizer = require('./src/routes/de_normalizer')
mongoose.set('useFindAndModify', false)

/**
 * Create connection to read database in mongo
 */
// const readDb = mongoose.connect('mongodb://' + config.host + '/' + config.readDb, { useNewUrlParser: true })
// readDb.connection.once('open', () => {
//     console.log(' [+] Message: The ' + config.readDb + ' database is connected')
// }).on('error', (error) => {
//     console.warn(' [*] WARNING: ', error)
// })

// Returns middleware that only parses urlencode bodies.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Returns middleware that only parses json,
// and only looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.json());

app.use('/api/supplier/products', require('./src/routes/products'))

app.listen(config.appPort, () => {
    console.log(' [+] Message: App listening on: ' + config.appHost + ':' + config.appPort)
})

const de_normalizer = new DeNormalizer()
de_normalizer.listen()

module.exports = app