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
        const newProduct = new ProductRead({
            productId: product.productId,
            title: product.title,
            category: product.category,
            price: product.price
        })

        newProduct.save()
            .then(() => {
                console.log("Product saved in read db")
            })
            .catch((e) => {
                console.log(e)
                console.log("Oeps het ging fout bij het opslaan in de read db")
            })
    }

    static updateProduct(product) {
        console.log(product)
        ProductRead.findOneAndUpdate({ productId: product._id }, {
            title: product.title, category: product.category, price: product.price
        }).then(() => {
            console.log("Product updated in read db")
        }).catch(() => {
            console.log("oeps toch niet")
        })
    }

}

module.exports = ProductReadRepository