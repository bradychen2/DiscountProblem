"use strict";
exports.__esModule = true;
exports.CartContext = void 0;
var decimal_js_1 = require("decimal.js");
var CartContext = /** @class */ (function () {
    function CartContext() {
        this.purchasedItems = [];
        this.appliedDiscounts = [];
        this.totalPrice = new decimal_js_1["default"](0);
    }
    return CartContext;
}());
exports.CartContext = CartContext;
