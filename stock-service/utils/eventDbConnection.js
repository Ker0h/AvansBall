const mongoose = require('mongoose');
const config = require('../config/config.json');

/**
 * Create connection to write database in mongo
 */
class EventDbConnection {
  static connectionFactory() {
    const eventDb = mongoose.createConnection(config.databases.eventDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    eventDb
      .once('open', () => {
        console.log(
          ` [+] Message: The ${config.databases.eventDb} database is connected`
        );
      })
      .on('error', (error) => {
        console.warn(' [*] WARNING: ', error);
      });

    return eventDb;
  }
}

module.exports = EventDbConnection;
