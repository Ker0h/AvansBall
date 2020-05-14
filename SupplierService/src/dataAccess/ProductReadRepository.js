const ProductRead = require('../schemas/ProductReadSchema');

class ProductReadRepository {

    static getAllProducts() {
        return new Promise((resolve, reject) => {
            ProductRead.find({})
                .then((products) => {
                    resolve({ status: 200, products })
                })
                .catch(() => {
                    const notFound = ApiErrors.notFound();
                    reject({ status: notFound.code, error: notFound })
                });
        })
    }

    static createProduct(product) {
        return new Promise((resolve, reject) => {
            const newProduct = new ProductRead({
                title: product.title,
                price: product.price,
                category: product.category
            })

            newProduct.save()
                .then(() => {
                    resolve({ status: 201, message: "Product created in read database", "supplierProduct": newProduct })
                })
                .catch(() => {
                    resolve({ status: 500, message: " [*] ERROR: Product not created." })
                })
        })
    }

}

module.exports = ProductReadRepository