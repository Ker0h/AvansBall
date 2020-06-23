const ProductWrite = require('../schemas/ProductWriteSchema');

class ProductWriteRepository {

    /**
     * Get all the products from the write database
     */
    static getAllProducts() {
        return new Promise((resolve, reject) => {
            ProductWrite.find({})
                .then((products) => resolve({ status: 200, products }))
                .catch(() => {
                    const notFound = ApiErrors.notFound();
                    reject({ status: notFound.code, error: notFound })
                });
        })
    }

    /**
     * Insert a product in the write database.
     * @param {String} title Name of the product.
     * @param {Number} price Price of the product, can be a decimal.
     * @param {String} category Product category of the product.
     */
    static createProduct(title, price, category) {
        return new Promise((resolve, reject) => {
            const product = new ProductWrite({
                title, category, price
            })

            product.save()
                .then(() => resolve({ status: 201, message: " [+] Supplier product created.", product }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Product not created." }))
        })
    }

    /**
     * Update the entire product.
     * @param {String} productId The mongoDB ObjectID("") of the product.
     * @param {String} title The new name of the product.
     * @param {Number} price New price of the product, can be a decimal.
     * @param {String} category New product category of the product.
     */
    static updateProduct(productId, title, price, category) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndUpdate({ _id: productId }, {
                title, category, price
            }).then(() => resolve({ status: 200, message: " [+] Supplier product updated." }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Product not updated." }))
        })
    }

    /**
     * Only update the title of the product.
     * @param {String} productId The mongoDB ObjectID("") of the product.
     * @param {String} title The new name of the product.
     */
    static updateProductTitle(productId, title) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndUpdate({ _id: productId }, { title: title })
                .then(() => resolve({ status: 200, message: " [+] Supplier product title updated." }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Supplier product name is not updated." }))
        })
    }

    /**
     * Only update the category of the product.
     * @param {String} productId The mongoDB  ObjectID("") of the product.
     * @param {String} category The new category of the product.
     */
    static updateProductCategory(productId, category) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndUpdate({ _id: productId }, { category: category })
                .then(() => resolve({ status: 200, message: " [+] Supplier product category updated." }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Supplier product category is not updated." }))
        })
    }

    /**
     * Only update the price of the product.
     * @param {String} productId The mongoDB ObjectID("") of the product. 
     * @param {Number} price The new price of the product.
     */
    static updateProductPrice(productId, price) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndUpdate({ _id: productId }, { price: price })
                .then(() => resolve({ status: 200, message: " [+] Supplier product price updated." }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Supplier product price is not updated." }))
        })
    }

    /**
     * Delete a single prodcut based on the given id.
     * @param {String} productId The mongoDB ObjectId("") of the product.
     */
    static deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndDelete({ _id: productId })
                .then(() => resolve({ status: 200, message: " [+] Supplier product deleted." }))
                .catch(() => reject({ status: 500, message: " [-] ERROR: Supplier product not deleted." }))
        })
    }

}

module.exports = ProductWriteRepository