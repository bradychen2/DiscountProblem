import Decimal from "decimal.js";
import { Product } from "./Product";

export interface RuleBase {
  id: number;
  name: string;
  note: string;
  process(products: Product[]): Iterable<Discount>;
}

export class Discount {
  public id: number;
  public ruleName: string;
  public products: Product[];
  public amount: Decimal;
  constructor(amount: Decimal, products: Product[], ruleName: string) {
    this.amount = amount;
    this.products = products;
    this.ruleName = ruleName;
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

  public *process(products: Product[]): Iterable<Discount> {
    let matchedProducts: Product[] = [];
    for (let product of products) {
      matchedProducts.push(product);
      if (matchedProducts.length == this.boxCount) {
        let amount: Decimal = new Decimal(0);
        matchedProducts.forEach((product) => {
          amount = amount.plus(product.price);
        });
        yield new Discount(
          amount.mul(this.percentOff).div(100),
          products,
          this.name
        );
        matchedProducts = [];
      }
    }
  }
}
