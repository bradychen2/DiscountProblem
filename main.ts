const products = require("./products.json");
import { Decimal } from "decimal.js";
import { Product } from "./Product";
import { RuleBase, Discount, BuyMoreBoxesDiscount } from "./Discount";

class Program {
  main(): void {
    const products: Product[] = this.loadProducts();
    products.forEach((product) => {
      console.log(`name: ${product.name} - price: ${product.price}`);
    });
    console.log(
      `Total: ${this.checkoutProcess(products, Array.from(this.loadRules()))}`
    );
  }

  checkoutProcess(products: Product[], rules: RuleBase[]): Decimal {
    let discounts: Discount[] = [];
    rules.forEach(function (rule) {
      discounts = discounts.concat(Array.from(rule.process(products)));
    });
    let amountWithoutDiscount: Decimal = new Decimal(0);
    let totalDiscount: Decimal = new Decimal(0);
    // original price
    products.forEach((product) => {
      amountWithoutDiscount = amountWithoutDiscount.plus(product.price);
    });
    // discount amount
    discounts.forEach((discount) => {
      totalDiscount = totalDiscount.plus(discount.amount);
      console.log(`符合折扣 ${discount.ruleName}, 折抵 ${discount.amount} 元`);
    });
    // original price - discount amount
    return amountWithoutDiscount.minus(totalDiscount);
  }

  loadProducts(): Product[] {
    const results: Product[] = [];
    const id = Math.floor(Date.now() / 1000);
    products.forEach((product) => {
      results.push(
        new Product(id, product.sku, product.name, new Decimal(product.price))
      );
    });
    return results;
  }

  *loadRules(): Iterable<RuleBase> {
    yield new BuyMoreBoxesDiscount(2, 12);
  }
}

const program = new Program();
program.main();
