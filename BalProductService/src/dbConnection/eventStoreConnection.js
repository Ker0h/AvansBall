const mongoose = require('mongoose')
const config = require('../../config.json')

/**
 * Create connection to eventStore database in mongo
 */
class EventStoreConnection {

    static connectionFactory() {
        const eventDb = mongoose.createConnection('mongodb://' + config.host + ':' + config.port + '/' + config.eventDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        eventDb.once('open', () => {
            console.log(' [+] Message: The ' + config.eventDb + ' database is connected')
        }).on('error', (error) => {
            console.warn(' [*] WARNING: ', error)
        })

        return eventDb
    }

}

module.exports = EventStoreConnection