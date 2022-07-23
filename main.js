"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const products = require("./testCases/TheSameProducts.json");
const decimal_js_1 = require("decimal.js");
const Product_1 = require("./Product");
const Discount_1 = require("./Discount");
const CartContext_1 = require("./CartContext");
const POS_1 = require("./POS");
class Program {
    main() {
        const cart = new CartContext_1.CartContext();
        const pos = new POS_1.POS();
        cart.purchasedItems.push(...this.loadProducts());
        pos.activeRules.push(...Array.from(this.loadRules()));
        pos.checkoutProcess(cart);
        console.log("購買商品:");
        console.log("--------------------------------------");
        cart.purchasedItems.forEach((item) => {
            console.log(`- ${item.id}, [${item.sku}] $${item.price}, ${item.name}, ${item.tagsValue()}`);
        });
        console.log("\n");
        console.log("折扣:");
        console.log("--------------------------------------");
        cart.appliedDiscounts.forEach((discount) => {
            console.log(`- 折抵 $${discount.amount}, ${discount.rule.name}, (${discount.rule.note})`);
            discount.products.forEach((product) => {
                console.log(`   * 符合: ${product.id}, [${product.sku}], ${product.name}, ${product.tagsValue()}`);
            });
            console.log("\n");
        });
        console.log("--------------------------------------");
        console.log(`$結帳金額: ${cart.totalPrice}`);
    }
    loadProducts() {
        const results = [];
        const id = Math.floor(Date.now() / 1000);
        products.forEach((product) => {
            results.push(new Product_1.Product(id, product.sku, product.name, new decimal_js_1.Decimal(product.price), product.tags));
        });
        return results;
    }
    *loadRules() {
        yield new Discount_1.BuyMoreBoxesDiscount(["熱銷飲品"], 2, 12);
        // yield new TotalPriceDiscount(new Decimal(1000), new Decimal(100));
        yield new Discount_1.SelectedItemsGetXDiscountY(["衛生紙"], 6, new decimal_js_1.Decimal(100));
        yield new Discount_1.theSameItemsGetNthPriceY(["同商品加購優惠"], 2, new decimal_js_1.Decimal(10));
    }
}
const program = new Program();
program.main();
//# sourceMappingURL=main.js.map