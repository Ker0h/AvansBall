const mongoose = require('mongoose')
const config = require('../../config.json')

/**
 * Create connection to eventstore database in mongo
 */
class EventStoreDbConnection {

    static connectionFactory() {
        const eventStoreDb = mongoose.createConnection('mongodb://' + config.eventStoreHost + ':' + config.eventStorePort + '/' + config.eventStoreDB, { useNewUrlParser: true, useUnifiedTopology: true })
        eventStoreDb.once('open', () => {
            console.log(' [+] Message: The ' + config.eventStoreDB + ' database is connected')
        }).on('error', (error) => {
            console.warn(' [*] WARNING: ', error)
        })

        return eventStoreDb
    }

}

module.exports = EventStoreDbConnection