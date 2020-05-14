const moment = require("moment")

class ErrorTemplate {
    constructor(code, message) {
        this.code = code
        this.message = message
        this.timestamp = moment.format('MMMM Do YYY, hh:mm:ss')
    }
}

module.exports = ErrorTemplate