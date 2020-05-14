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

    static createProduct(title, price) {
        return new Promise((resolve, reject) => {
            const product = new ProductWrite({
                title, price
            })

            product.save()
                .then(() => {
                    resolve({ status: 201, message: "Supplier product created.", product })
                })
                .catch(() => {
                    resolve({ status: 500, message: " [*] ERROR: Product not created." })
                })
        })
    }

}

module.exports = ProductWriteRepository