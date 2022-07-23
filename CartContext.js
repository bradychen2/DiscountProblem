"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartContext = void 0;
const decimal_js_1 = require("decimal.js");
class CartContext {
    constructor() {
        this.purchasedItems = [];
        this.appliedDiscounts = [];
        this.totalPrice = new decimal_js_1.default(0);
    }
}
exports.CartContext = CartContext;
//# sourceMappingURL=CartContext.js.map