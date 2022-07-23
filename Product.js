"use strict";
exports.__esModule = true;
exports.Product = void 0;
var Product = /** @class */ (function () {
    function Product(id, sku, name, price, tags) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.tags = new Set(tags);
    }
    Product.prototype.tagsValue = function () {
        if (this.tags === null || this.tags.size === 0)
            return "";
        var tagsValue = [];
        this.tags.forEach(function (t) { return tagsValue.push("#" + t); });
        return tagsValue.join(",");
    };
    return Product;
}());
exports.Product = Product;
