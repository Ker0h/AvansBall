const EventStore = require('../schemas/EventStoreSchema')
const moment = require('moment')
const ApiErrors = require('../errorMessages/Error')

class EventStoreRepository {

    /**
     * Get all the events from the EventStore database.
     */
    static getAllEvents() {
        return new Promise((resolve, reject) => {
            EventStore.find({})
                .then((events) => resolve({status: 200, events}))
                .catch(() => {
                    const notFound = ApiErrors.notFound();
                    reject({status: notFound.code, error: notFound})
                });
        })
    }

    /**
     * Create a new event in the EventStore database. Usually called from the rabbitMQ bus.
     * @param event
     * @param {Object} product The product object that contains all the values to create a new product.
     */
    static createEvent(event, product) {
        const newEvent = new EventStore({
            event: event,
            product: {
                productId: product.productId,
                title: product.title || "Not Included in Event",
                category: product.category || "Not Included in Event",
                price: product.price || 666,
                isSupplierProduct: product.isSupplierProduct || false,
                supplier: product.supplier || "Not Included in Event",
            },
            date: moment().format('MM DD YYYY, hh:mm:ss')
        })

        newEvent.save()
            .then(() => console.log(" [+] Event saved in EventStore db."))
            .catch((e) => console.log(" [-] Whoops something went wrong by saving the object in the EventStore db."))
    }
}

module.exports = EventStoreRepository