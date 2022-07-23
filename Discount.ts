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
export class BuyMoreBoxesDiscount extends RuleBase {
  public readonly boxCount: number = 0;
  public readonly percentOff: number = 0;
  public readonly targetTags: Set<string>;
  constructor(targetTags: Array<string>, boxes: number, percentOff: number) {
    super();
    this.boxCount = boxes;
    this.percentOff = percentOff;
    this.targetTags = new Set(targetTags);
    this.name = `滿件折扣 - 6`;
    this.note = `${this.boxCount} 箱結帳 ${100 - this.percentOff} 折`;
  }
  // 折扣規則的實作
  public *process(cart: CartContext): Iterable<Discount> {
    let tagsMap: Map<string, Product[]> = new Map();
    for (let item of cart.purchasedItems) {
      for (let tag of item.tags) {
        if (this.targetTags.has(tag) && !tagsMap.has(tag)) {
          tagsMap.set(tag, [item]);
          continue;
        }
        if (this.targetTags.has(tag) && tagsMap.has(tag)) {
          tagsMap.get(tag).push(item);
        }
      }
    }
    for (let [tag, itemsHasTargetTag] of tagsMap) {
      const matchedItems: Product[] = [];
      itemsHasTargetTag.sort((a, b) => Number(b.price.minus(a.price)));
      for (let item of itemsHasTargetTag) {
        matchedItems.push(item);
        if (matchedItems.length === this.boxCount) {
          let amount: Decimal = new Decimal(0);
          matchedItems.forEach((product) => {
            amount = amount.plus(product.price);
          });
          yield new Discount(
            amount.mul(this.percentOff).div(100),
            [...matchedItems],
            this
          );
          matchedItems.splice(0);
        }
      }
    }
  }
}

// 滿 ** 送 **
export class TotalPriceDiscount extends RuleBase {
  public readonly minDiscountPrice: Decimal;
  public readonly discountAmount: Decimal;
  constructor(minPrice: Decimal, discount: Decimal) {
    super();
    this.minDiscountPrice = minPrice;
    this.discountAmount = discount;
    this.name = `折價滿 ${this.minDiscountPrice} 送 ${this.discountAmount}`;
    this.note = `每次交易限用一次`;
  }

  public *process(cart: CartContext): Iterable<Discount> {
    if (cart.totalPrice.gte(this.minDiscountPrice)) {
      yield new Discount(this.discountAmount, cart.purchasedItems, this);
    }
  }
}

// 指定商品 X 件折 Y 元
export class SelectedItemsGetXDiscountY extends RuleBase {
  public readonly minCount: number;
  public readonly amount: Decimal;
  public readonly targetTags: Set<string>;
  constructor(targetTags: Array<string>, minCount: number, amount: Decimal) {
    super();
    this.minCount = minCount;
    this.amount = amount;
    this.targetTags = new Set(targetTags);
    this.name = `滿件折扣 - 1`;
    this.note = `指定商品滿 ${minCount} 件便宜 ${amount} 元`;
  }

  public *process(cart: CartContext): Iterable<Discount> {
    const matchedProducts: Product[] = [];
    let tag: string;
    cart.purchasedItems.sort((a, b): number => {
      const aSku = a.sku.toUpperCase();
      const bSku = b.sku.toUpperCase();
      if (aSku < bSku) {
        return -1;
      }
      if (aSku > bSku) {
        return 1;
      }
      return 0;
    });
    for (let item of cart.purchasedItems) {
      // make intersection between targetTags and item's tags
      let intersection = new Set(
        [...item.tags].filter((tag) => {
          return this.targetTags.has(tag);
        })
      );
      // if the item has the tag matches this discount
      if (intersection.size === 1) {
        if (!item.tags.has(tag)) {
          matchedProducts.splice(0);
          tag = intersection.values().next().value;
        }
        matchedProducts.push(item);
        if (matchedProducts.length === this.minCount) {
          yield new Discount(this.amount, [...matchedProducts], this);
          matchedProducts.splice(0);
        }
      }
      if (intersection.size > 1) {
        throw Error(
          `more than one tags in the same product match the discount rule`
        );
      }
    }
  }
}

// 指定商品 X 件 Y 折
export class SelectedItemsGetXPercentOff extends RuleBase {
  public readonly minCount: number;
  public readonly percentOff: number;
  public readonly targetTags: Set<string>;
  constructor(targetTags: Array<string>, minCount: number, percentOff: number) {
    super();
    this.minCount = minCount;
    this.percentOff = percentOff;
    this.targetTags = new Set(targetTags);
    this.name = `滿件折扣 - 2`;
    this.note = `指定商品滿 ${minCount} 件打 ${(10 - percentOff) / 10} 折`;
  }

  public *process(cart: CartContext): Iterable<Discount> {
    let matchedProducts: Product[] = [];
    let tag: string;
    cart.purchasedItems.sort((a, b): number => {
      const aSku = a.sku.toUpperCase();
      const bSku = b.sku.toUpperCase();
      if (aSku < bSku) {
        return -1;
      }
      if (aSku > bSku) {
        return 1;
      }
      return 0;
    });
    for (let item of cart.purchasedItems) {
      // make intersection between targetTags and item's tags
      let intersection = new Set(
        [...item.tags].filter((tag) => {
          return this.targetTags.has(tag);
        })
      );
      // if the item has the tag matches this discount
      if (intersection.size === 1) {
        if (!item.tags.has(tag)) {
          matchedProducts.splice(0);
          tag = intersection.values().next().value;
        }
        matchedProducts.push(item);
        if (matchedProducts.length === this.minCount) {
          let amount: Decimal = new Decimal(0);
          matchedProducts.forEach((product) => {
            amount = amount.plus(product.price);
          });
          yield new Discount(
            amount.mul(this.percentOff).div(100),
            [...matchedProducts],
            this
          );
          matchedProducts.splice(0);
        }
      }
      if (intersection.size > 1) {
        throw Error(
          `more than one tags in the same product match the discount rule`
        );
      }
    }
  }
}

// 同商品第 X 件 Y 元
export class theSameItemsGetNthPriceY extends RuleBase {
  public readonly minCount: number;
  public readonly price: Decimal;
  public readonly targetTags: Set<string>;
  constructor(targetTags: Array<string>, minCount: number, price: Decimal) {
    super();
    this.minCount = minCount;
    this.price = price;
    this.targetTags = new Set(targetTags);
    this.name = `滿件折扣 - 3`;
    this.note = `同商品第 ${minCount} 件 ${price} 元`;
  }

  public *process(cart: CartContext): Iterable<Discount> {
    // create tags Map, only contains tags applied this rule.
    let tagsMap: Map<string, Product[]> = new Map();
    for (let item of cart.purchasedItems) {
      for (let tag of item.tags) {
        if (this.targetTags.has(tag) && !tagsMap.has(tag)) {
          tagsMap.set(tag, [item]);
          continue;
        }
        if (this.targetTags.has(tag) && tagsMap.has(tag)) {
          tagsMap.get(tag).push(item);
        }
      }
    }
    for (let [tag, itemsHasTargetTag] of tagsMap) {
      const matchedItems: Product[] = [];
      let sku: string;
      itemsHasTargetTag.sort((a, b): number => {
        const aSku = a.sku.toUpperCase();
        const bSku = b.sku.toUpperCase();
        if (aSku < bSku) {
          return -1;
        }
        if (aSku > bSku) {
          return 1;
        }
        return 0;
      });
      for (let item of itemsHasTargetTag) {
        if (item.sku !== sku) {
          matchedItems.splice(0);
          sku = item.sku;
        }
        matchedItems.push(item);
        if (matchedItems.length === this.minCount) {
          yield new Discount(
            item.price.minus(this.price),
            [...matchedItems],
            this
          );
          matchedItems.splice(0);
        }
      }
    }
  }
}
