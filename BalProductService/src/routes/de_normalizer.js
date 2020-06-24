const ProductReadRepository = require('../dataAccess/ProductReadRepository')

class DeNormalizer {
    insertIntoRead(balProduct) {
        const product = balProduct.balProduct

        switch (balProduct.event) {
            case "BalProductCreated":
                ProductReadRepository.createProduct(product)
                break;
            case "BalProductUpdated":
                ProductReadRepository.updateProduct(product)
                break;
            case "BalProductDeleted":
                ProductReadRepository.deleteProduct(product.productId)
                break;
            case "BalProductTitleUpdated":
                ProductReadRepository.updateProductTitle(product.productId, product.title)
                break;
            case "BalProductCategoryUpdated":
                ProductReadRepository.updateProductCategory(product.productId, product.category)
                break;
            case "BalProductPriceUpdated":
                ProductReadRepository.updateProductPrice(product.productId, product.price)
                break;
        }
    }
}

module.exports = DeNormalizer