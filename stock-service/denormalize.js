const Stock = require('./models/schemas/stock.schema');

const ReadModel = Stock.readStock;

const denormalize = (msg) => {
  const denormalized = JSON.parse(msg.content);
  const name  = denormalized.data.name;
  
  if(denormalized.event === "ProductDeleted") {
    ReadModel.findOneAndDelete({name: name})
    .then((stock) => {
      console.log("Deleted read model: " + stock)
    })
  }
  
  const amount = denormalized.data.amount;
  const category = denormalized.data.category;
  const price = denormalized.data.price;
  const supplier = denormalized.data.isSupplierProducts;
  
  if(denormalized.event === "ProductAdded") {
    const stock = new ReadModel({ name, amount, category, price, supplier });
    stock.save();
  }
  
  if(denormalized.event === "ProductUpdated") {
    ReadModel.findOneAndUpdate({name: name}, {name: denormalized.data.newName, amount: amount, category: category, price: price})
    .then((stock) => {
      console.log("Updated read model: " + stock)
    })
  }
}

module.exports = denormalize;
