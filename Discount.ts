import Decimal from "decimal.js";
import { CartContext } from "./CartContext";
import { Product } from "./Product";

export abstract class RuleBase {
  id: number;
  name: string;
  note: string;
  abstract process(cart: CartContext): Iterable<Discount>;
}

export class Discount {
  public id: number;
  public rule: RuleBase;
  public products: Product[];
  public amount: Decimal;
  constructor(amount: Decimal, products: Product[], rule: RuleBase) {
    this.amount = amount;
    this.products = products;
    this.rule = rule;
  }
}

// 兩箱折扣
export class BuyMoreBoxesDiscount implements RuleBase {
  public readonly boxCount: number = 0;
  public readonly percentOff: number = 0;
  public id: number;
  public name: string;
  public note: string;

  constructor(boxes: number, percentOff: number) {
    this.boxCount = boxes;
    this.percentOff = percentOff;
    this.name = `${this.boxCount} 箱結帳 ${100 - this.percentOff} 折`;
    this.note = `熱銷飲品 限時優惠`;
  }
  // 折扣規則的實作
  public *process(cart: CartContext): Iterable<Discount> {
    let matchedProducts: Product[] = [];
    for (let product of cart.purchasedItems) {
      matchedProducts.push(product);
      if (matchedProducts.length == this.boxCount) {
        let amount: Decimal = new Decimal(0);
        matchedProducts.forEach((product) => {
          amount = amount.plus(product.price);
        });
        yield new Discount(
          amount.mul(this.percentOff).div(100),
          [...matchedProducts], // deep copy
          this
        );
        matchedProducts.splice(0);
      }
    }
  }
}
