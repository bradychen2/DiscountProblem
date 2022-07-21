"use strict";
exports.__esModule = true;
exports.POS = void 0;
var decimal_js_1 = require("decimal.js");
var POS = /** @class */ (function () {
    function POS() {
        this.activeRules = [];
    }
    POS.prototype.checkoutProcess = function (cart) {
        // reset cart
        cart.appliedDiscounts.splice(0);
        // original total price of items in the cart
        cart.purchasedItems.forEach(function (item) {
            cart.totalPrice = cart.totalPrice.plus(item.price);
        });
        this.activeRules.forEach(function (rule) {
            var _a;
            var discounts = rule.process(cart);
            (_a = cart.appliedDiscounts).push.apply(_a, Array.from(discounts));
            // total discount amount
            var totalDiscount = new decimal_js_1["default"](0);
            cart.appliedDiscounts.forEach(function (discount) {
                totalDiscount = totalDiscount.plus(discount.amount);
            });
            // original total price - total discount amount
            cart.totalPrice = cart.totalPrice.minus(totalDiscount);
        });
        return true;
    };
    return POS;
}());
exports.POS = POS;
