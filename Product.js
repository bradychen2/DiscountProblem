"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id, sku, name, price, tags) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.tags = new Set(tags);
    }
    tagsValue() {
        if (this.tags === null || this.tags.size === 0)
            return "";
        const tagsValue = [];
        this.tags.forEach((t) => tagsValue.push("#" + t));
        return tagsValue.join(",");
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map