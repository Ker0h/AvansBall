const SupplierEventStore = require("../schemas/SupplierEventStoreSchema")
const moment = require("moment")

class SupplierEventStoreRepository {

    static AddToEventStore(event, product) {
        const newEventStoreData = new SupplierEventStore({
            event: event,
            data: product,
            timestamp: moment().format('MMMM Do YYY, hh:mm:ss')
        })

        newEventStoreData.save()
            .then(() => console.log(" [+] Event succesfully added to event store."))
            .catch(() => console.log(" [-] Error: Event not added to event store."))
    }

}

module.exports = SupplierEventStoreRepository