const ErrorTemplate = require('./ErrorTemplate')
class Error {
    static notFound(object = "Object") {
        return new ErrorTemplate(404, object + ' not found')
    }
}

module.exports = Error