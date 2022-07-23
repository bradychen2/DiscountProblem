"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POS = void 0;
const decimal_js_1 = require("decimal.js");
class POS {
    constructor() {
        this.activeRules = [];
    }
    checkoutProcess(cart) {
        // reset cart
        cart.appliedDiscounts.splice(0);
        // original total price of items in the cart
        cart.purchasedItems.forEach((item) => {
            cart.totalPrice = cart.totalPrice.plus(item.price);
        });
        this.activeRules.forEach((rule) => {
            const discounts = rule.process(cart);
            cart.appliedDiscounts.push(...Array.from(discounts));
        });
        // total discount amount
        let totalDiscount = new decimal_js_1.default(0);
        cart.appliedDiscounts.forEach((discount) => {
            totalDiscount = totalDiscount.plus(discount.amount);
        });
        // original total price - total discount amount
        cart.totalPrice = cart.totalPrice.minus(totalDiscount);
        return true;
    }
}
exports.POS = POS;
//# sourceMappingURL=POS.js.map