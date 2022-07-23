const products = require("./testCases/TheSameProducts.json");
import { Decimal } from "decimal.js";
import { Product } from "./Product";
import {
  RuleBase,
  BuyMoreBoxesDiscount,
  TotalPriceDiscount,
  SelectedItemsGetXDiscountY,
  theSameItemsGetNthPriceY,
} from "./Discount";
import { CartContext } from "./CartContext";
import { POS } from "./POS";

class Program {
  main(): void {
    const cart: CartContext = new CartContext();
    const pos: POS = new POS();
    cart.purchasedItems.push(...this.loadProducts());
    pos.activeRules.push(...Array.from(this.loadRules()));
    pos.checkoutProcess(cart);

    console.log("購買商品:");
    console.log("--------------------------------------");
    cart.purchasedItems.forEach((item) => {
      console.log(
        `- ${item.id}, [${item.sku}] $${item.price}, ${
          item.name
        }, ${item.tagsValue()}`
      );
    });
    console.log("\n");
    console.log("折扣:");
    console.log("--------------------------------------");
    cart.appliedDiscounts.forEach((discount) => {
      console.log(
        `- 折抵 $${discount.amount}, ${discount.rule.name}, (${discount.rule.note})`
      );
      discount.products.forEach((product) => {
        console.log(
          `   * 符合: ${product.id}, [${product.sku}], ${
            product.name
          }, ${product.tagsValue()}`
        );
      });
      console.log("\n");
    });
    console.log("--------------------------------------");
    console.log(`$結帳金額: ${cart.totalPrice}`);
  }

  loadProducts(): Product[] {
    const results: Product[] = [];
    const id = Math.floor(Date.now() / 1000);
    products.forEach((product) => {
      results.push(
        new Product(
          id,
          product.sku,
          product.name,
          new Decimal(product.price),
          product.tags
        )
      );
    });
    return results;
  }

  *loadRules(): Iterable<RuleBase> {
    yield new BuyMoreBoxesDiscount(["熱銷飲品"], 2, 12);
    // yield new TotalPriceDiscount(new Decimal(1000), new Decimal(100));
    yield new SelectedItemsGetXDiscountY(["衛生紙"], 6, new Decimal(100));
    yield new theSameItemsGetNthPriceY(["同商品加購優惠"], 2, new Decimal(10));
  }
}

const program = new Program();
program.main();
