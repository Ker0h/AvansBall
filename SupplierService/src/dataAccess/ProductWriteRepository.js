const ProductWrite = require('../schemas/ProductWriteSchema');

class ProductWriteRepository {

    static getAllProducts() {
        return new Promise((resolve, reject) => {
            ProductWrite.find({})
                .then((products) => {
                    resolve({ status: 200, products })
                })
                .catch(() => {
                    const notFound = ApiErrors.notFound();
                    reject({ status: notFound.code, error: notFound })
                });
        })
    }

    static createProduct(title, price, category) {
        return new Promise((resolve, reject) => {
            const product = new ProductWrite({
                title, category, price
            })

            product.save()
                .then(() => {
                    resolve({ status: 201, message: " [+] Supplier product created.", product })
                })
                .catch(() => {
                    reject({ status: 500, message: " [-] ERROR: Product not created." })
                })
        })
    }

    static updateProduct(productId, title, price, category) {
        return new Promise((resolve, reject) => {
            ProductWrite.findOneAndUpdate({ _id: productId }, {
                title, category, price
            }).then(() => {
                resolve({ status: 200, message: " [+] Supplier product updated" })
            }).catch(() => {
                reject({ status: 500, message: " [-] ERROR: Product not updated" })
            })
        })
    }

}

module.exports = ProductWriteRepository