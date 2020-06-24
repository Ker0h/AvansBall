const ProductRead = require('../schemas/ProductReadSchema');

class ProductReadRepository {

    /**
     * Get all the products from the Read database.
     */
    static getAllProducts() {
        return new Promise((resolve, reject) => {
            ProductRead.find({})
                .then((products) => resolve({status: 200, products}))
                .catch(() => {
                    const notFound = ApiErrors.notFound();
                    reject({status: notFound.code, error: notFound})
                });
        })
    }

    /**
     * Create a new product in the read database. Usually called from the rabbitMQ bus.
     * @param {Object} product The product object that contains all the values to create a new product.
     */
    static createProduct(product) {
        const newProduct = new ProductRead({
            productId: product.productId,
            title: product.title,
            category: product.category,
            price: product.price,
            isSupplierProduct: product.isSupplierProduct,
            supplier: product.supplier
        })

        newProduct.save()
            .then(() => console.log(" [+] Product saved in read db."))
            .catch((e) => console.log(" [-] Whoops something went wrong by saving the object in the read db."))
    }

    /**
     * Update an entire product based on the product id.
     * @param {Object} product The prodcut object that contains all the values to update an existing product.
     */
    static updateProduct(product) {
        ProductRead.findOneAndUpdate({productId: product.productId}, {
            title: product.title, category: product.category, price: product.price
        }).then(() => console.log(" [+] Product updated in read db."))
            .catch(() => console.log(" [-] Whoops something went wrong by updating the object in the read db."))
    }

    /**
     * Only update the title of the product in the read database.
     * @param {String} productId The mongoDB ObjectID("") of the product.
     * @param {String} title The new name of the product.
     */
    static updateProductTitle(productId, title) {
        ProductRead.findOneAndUpdate({productId: productId}, {title: title})
            .then(() => console.log(" [+] Product title updated"))
            .catch(() => console.log(" [-] ERROR: Product name is not updated in the read database."))
    }

    /**
     * Only update the category of the product in the read database.
     * @param {String} productId The mongoDB  ObjectID("") of the product.
     * @param {String} category The new category of the product.
     */
    static updateProductCategory(productId, category) {
        ProductRead.findOneAndUpdate({productId: productId}, {category: category})
            .then(() => console.log(" [+] Product category updated."))
            .catch(() => console.log(" [-] ERROR: Product category is not updated in the read database."))
    }

    /**
     * Only update the price of the product in the read database.
     * @param {String} productId The mongoDB ObjectID("") of the product.
     * @param {Number} price The new price of the product.
     */
    static updateProductPrice(productId, price) {
        ProductRead.findOneAndUpdate({productId: productId}, {price: price})
            .then(() => console.log(" [+] Product price updated."))
            .catch(() => console.log(" [-] ERROR: Product price is not updated in the read database."))
    }

    /**
     * Delete a single product from the read database.
     * @param {String} productId The mongoDB ObjectID("") to get the correct product.
     */
    static deleteProduct(productId) {
        ProductRead.findOneAndDelete({productId: productId})
            .then(() => console.log(" [+] Product deleted in Read database."))
            .catch(() => console.log(" [-] ERROR: Product is not deleted from read database."))
    }

}

module.exports = ProductReadRepository