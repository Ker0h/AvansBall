class ProductAdded {
  constructor(name, amount, category, price, isSupplierProduct) {
    this.name = name;
    this.amount = amount;
    this.category = category;
    this.price = price;
    this.isSupplierProduct = isSupplierProduct;
  }
}

module.exports = ProductAdded;
