class SupplierProductCreated {
    constructor(id, title, price, category, amount) {
        this.productId = id
        this.title = title
        this.price = price
        this.category = category
        this.amount = amount
        this.isSupplierProduct = true
    }
}

module.exports = SupplierProductCreated