const ProductReadRepository = require('../dataAccess/ProductReadRepository')
const Events = require('../utils/Events')

class DeNormalizer {
    insertIntoRead(supplierProduct) {
        const product = supplierProduct.supplierProduct

        switch (supplierProduct.event) {
            case Events.SUPPLIER_PRODUCT_CREATED:
                ProductReadRepository.createProduct(product)
                break
            case Events.SUPPLIER_PRODUCT_UPDATED:
                ProductReadRepository.updateProduct(product)
                break
            case Events.SUPPLIER_PRODUCT_DELETED:
                ProductReadRepository.deleteProduct(product.productId)
                break
            case Events.SUPPLIER_PRODUCT_TITLE_UPDATED:
                ProductReadRepository.updateProductTitle(product.productId, product.title)
                break
            case Events.SUPPLIER_PRODUCT_CATEGORY_UPDATED:
                ProductReadRepository.updateProductCategory(product.productId, product.category)
                break
            case Events.SUPPLIER_PRODUCT_PRICE_UPDATED:
                ProductReadRepository.updateProductPrice(product.productId, product.price)
                break
            default:
                console.warn(" [-] ERROR: Event does not exist.")
        }
    }
}

module.exports = DeNormalizer