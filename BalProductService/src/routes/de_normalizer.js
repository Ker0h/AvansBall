const ProductReadRepository = require('../dataAccess/ProductReadRepository')
const EventStoreRepository = require('../dataAccess/EventStoreRepository')

class DeNormalizer {
    insertIntoRead(balProduct) {
        const product = balProduct.balProduct

        EventStoreRepository.createEvent(balProduct.event, product)

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
            default:
                break;
        }
    }
}

module.exports = DeNormalizer