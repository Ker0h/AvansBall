const mongoose = require('mongoose')
const config = require('../../config.json')

/**
 * Create connection to read database in mongo
 */
class ReadDbConnection {

    static connectionFactory() {
        const readDb = mongoose.createConnection('mongodb://' + config.host + ':' + config.port + '/' + config.readDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        readDb.once('open', () => {
            console.log(' [+] Message: The ' + config.readDb + ' database is connected')
        }).on('error', (error) => {
            console.warn(' [*] WARNING: ', error)
        })

        return readDb
    }

}

module.exports = ReadDbConnection