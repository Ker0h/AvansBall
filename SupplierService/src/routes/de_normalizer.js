const ProductReadRepository = require('../dataAccess/ProductReadRepository')

class DeNormalizer {
    insertIntoRead(supplierProduct) {
        const product = supplierProduct.supplierProduct

        if (supplierProduct.event === "SupplierProductCreated") {
            ProductReadRepository.createProduct(product)
        }

        if (supplierProduct.event === "SupplierProductUpdated") {
            ProductReadRepository.updateProduct(product)
        }

        if (supplierProduct.event === "SupplierProductDeleted") {
            ProductReadRepository.deleteProduct(product.productId)
        }

        if (supplierProduct.event === "SupplierProductTitleUpdated") {
            ProductReadRepository.updateProductTitle(product.productId, product.title)
        }

        if (supplierProduct.event === "SupplierProductCategoryUpdated") {
            ProductReadRepository.updateProductCategory(product.productId, product.category)
        }

        if (supplierProduct.event === "SupplierProductPriceUpdated") {
            ProductReadRepository.updateProductPrice(product.productId, product.price)
        }
    }
}

module.exports = DeNormalizer