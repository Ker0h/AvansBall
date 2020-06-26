const mongoose = require('mongoose');
const config = require('../config/config.json');

class ReadDbConnection {
  static connectionFactory() {
    const readDb = mongoose.createConnection(config.databases.readDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    readDb
      .once('open', () => {
        console.log(` [+] Message: The ${config.databases.readDb} database is connected`);
      })
      .on('error', (error) => {
        console.warn(' [*] WARNING: ', error);
      });

    return readDb;
  }
}

module.exports = ReadDbConnection;
