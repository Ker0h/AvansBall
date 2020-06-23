const ProductReadRepository = require('../dataAccess/ProductReadRepository')

class DeNormalizer {
    insertIntoRead(supplierProduct) {
        if (supplierProduct.event === "SupplierProductCreated") {
            ProductReadRepository.createProduct(supplierProduct.supplierProduct)
        }

        if (supplierProduct.event === "SupplierProductUpdated") {
            ProductReadRepository.updateProduct(supplierProduct.supplierProduct)
        }

        if (supplierProduct.event === "SupplierProductDeleted") {
            ProductReadRepository.deleteProduct(supplierProduct.supplierProduct.productId)
        }
    }
}

module.exports = DeNormalizer