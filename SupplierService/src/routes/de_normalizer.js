const ProductReadRepository = require('../dataAccess/ProductReadRepository')
const Events = require('../utils/Events')
const SupplierEventStoreRepository = require('../dataAccess/SupplierEventStoreRepository')

class DeNormalizer {
    insertIntoRead(supplierProduct) {
        const event = supplierProduct.event
        const product = supplierProduct.supplierProduct

        switch (event) {
            case Events.SUPPLIER_PRODUCT_CREATED:
                ProductReadRepository.createProduct(product)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            case Events.SUPPLIER_PRODUCT_UPDATED:
                ProductReadRepository.updateProduct(product)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            case Events.SUPPLIER_PRODUCT_DELETED:
                ProductReadRepository.deleteProduct(product.productId)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            case Events.SUPPLIER_PRODUCT_TITLE_UPDATED:
                ProductReadRepository.updateProductTitle(product.productId, product.title)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            case Events.SUPPLIER_PRODUCT_CATEGORY_UPDATED:
                ProductReadRepository.updateProductCategory(product.productId, product.category)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            case Events.SUPPLIER_PRODUCT_PRICE_UPDATED:
                ProductReadRepository.updateProductPrice(product.productId, product.price)
                SupplierEventStoreRepository.AddToEventStore(event, product)
                break
            default:
                console.warn(" [-] ERROR: Event does not exist.")
        }
    }
}

module.exports = DeNormalizer