const mongoose = require('mongoose');
const config = require('../config/config.json');

/**
 * Create connection to write database in mongo
 */
class WriteDbConnection {
  static connectionFactory() {
    const writeDb = mongoose.createConnection(config.databases.writeDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    writeDb
      .once('open', () => {
        console.log(
          ` [+] Message: The ${config.writeDb} database is connected`
        );
      })
      .on('error', (error) => {
        console.warn(' [*] WARNING: ', error);
      });

    return writeDb;
  }
}

module.exports = WriteDbConnection;
