const Stock = require('../models/schemas/stock.schema');
const Event = require('../models/schemas/event.schema');

const ReadModel = Stock.readStock;
const EventModel = Event.Event;

class Denormalizer {

  insert(msg) {

    const denormalized = JSON.parse(msg.content);

    const id = denormalized.data.id;
    const name = denormalized.data.name || null;
    let amount = denormalized.data.amount || null;
    const category = denormalized.data.category || null;
    const price = denormalized.data.price || null;
    const supplier = denormalized.data.isSupplierProduct || null;

    const event = new EventModel({
      id: id,
      name: denormalized.event,
      productName: name,
      productAmount: amount,
      productCategory: category,
      productPrice: price
    });

    event.save()
      .then((stock) => {
        console.log("EVENT: " + JSON.stringify(event));
      })

    switch (denormalized.event) {
      case "ProductAdded":
        const stock = new ReadModel({ name, amount, category, price, supplier });
        stock.save()
        .then((stock) => {
          console.log("Added read model: " + stock);
        });
        break;

      case "ProductUpdated":
        ReadModel.findByIdAndUpdate(id, { name: name, amount: amount, category: category, price: price })
          .then((stock) => {
            console.log("Updated read model: " + stock);
          })
        break;

      case "ProductDeleted":
        ReadModel.findByIdAndDelete(id).then((stock) => {
          console.log("Deleted read model: " + stock);
        });
        break;

      case "ProductAmountIncreased":
        ReadModel.findById(id)
          .then((stock) => {

            ReadModel.findByIdAndUpdate(id, { amount: stock.amount + amount })
              .then((stock) => {
                console.log("Increased product amount in read model with: " + amount);
              });
          });
        break;

      case "ProductAmountDecreased":
        ReadModel.findById(id)
          .then((stock) => {

            ReadModel.findByIdAndUpdate(id, { amount: stock.amount - amount })
              .then((stock) => {
                console.log("Decreased product amount in read model with: " + amount);
              });
          });
        break;

      case "ProductNameChanged":
        ReadModel.findByIdAndUpdate(id, { name: name })
          .then((stock) => {
            console.log("Changed product name in read model to: " + name);
          });
        break;

      case "ProductCategoryChanged":
        ReadModel.findByIdAndUpdate(id, { category: category })
          .then((stock) => {
            console.log("Changed product category in read model to: " + category);
          });
        break;

      case "ProductPriceChanged":
        ReadModel.findByIdAndUpdate(id, { price: price })
          .then((stock) => {
            console.log("Changed product price in read model to: " + price);
          });
        break;

      default:
        break;
    }
  }
}

module.exports = Denormalizer;
