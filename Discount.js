"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theSameItemsGetNthPriceY = exports.SelectedItemsGetXPercentOff = exports.SelectedItemsGetXDiscountY = exports.TotalPriceDiscount = exports.BuyMoreBoxesDiscount = exports.Discount = exports.RuleBase = void 0;
const decimal_js_1 = require("decimal.js");
class RuleBase {
}
exports.RuleBase = RuleBase;
class Discount {
    constructor(amount, products, rule) {
        this.amount = amount;
        this.products = products;
        this.rule = rule;
    }
}
exports.Discount = Discount;
// 兩箱折扣
class BuyMoreBoxesDiscount extends RuleBase {
    constructor(targetTags, boxes, percentOff) {
        super();
        this.boxCount = 0;
        this.percentOff = 0;
        this.boxCount = boxes;
        this.percentOff = percentOff;
        this.targetTags = new Set(targetTags);
        this.name = `滿件折扣 - 6`;
        this.note = `${this.boxCount} 箱結帳 ${100 - this.percentOff} 折`;
    }
    // 折扣規則的實作
    *process(cart) {
        let tagsMap = new Map();
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
            const matchedItems = [];
            itemsHasTargetTag.sort((a, b) => Number(b.price.minus(a.price)));
            for (let item of itemsHasTargetTag) {
                matchedItems.push(item);
                if (matchedItems.length === this.boxCount) {
                    let amount = new decimal_js_1.default(0);
                    matchedItems.forEach((product) => {
                        amount = amount.plus(product.price);
                    });
                    yield new Discount(amount.mul(this.percentOff).div(100), [...matchedItems], this);
                    matchedItems.splice(0);
                }
            }
        }
    }
}
exports.BuyMoreBoxesDiscount = BuyMoreBoxesDiscount;
// 滿 ** 送 **
class TotalPriceDiscount extends RuleBase {
    constructor(minPrice, discount) {
        super();
        this.minDiscountPrice = minPrice;
        this.discountAmount = discount;
        this.name = `折價滿 ${this.minDiscountPrice} 送 ${this.discountAmount}`;
        this.note = `每次交易限用一次`;
    }
    *process(cart) {
        if (cart.totalPrice.gte(this.minDiscountPrice)) {
            yield new Discount(this.discountAmount, cart.purchasedItems, this);
        }
    }
}
exports.TotalPriceDiscount = TotalPriceDiscount;
// 指定商品 X 件折 Y 元
class SelectedItemsGetXDiscountY extends RuleBase {
    constructor(targetTags, minCount, amount) {
        super();
        this.minCount = minCount;
        this.amount = amount;
        this.targetTags = new Set(targetTags);
        this.name = `滿件折扣 - 1`;
        this.note = `指定商品滿 ${minCount} 件便宜 ${amount} 元`;
    }
    *process(cart) {
        const matchedProducts = [];
        let tag;
        for (let item of cart.purchasedItems) {
            // make intersection between targetTags and item's tags
            let intersection = new Set([...item.tags].filter((tag) => {
                return this.targetTags.has(tag);
            }));
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
                throw Error(`more than one tags in the same product match the discount rule`);
            }
        }
    }
}
exports.SelectedItemsGetXDiscountY = SelectedItemsGetXDiscountY;
// 指定商品 X 件 Y 折
class SelectedItemsGetXPercentOff extends RuleBase {
    constructor(targetTags, minCount, percentOff) {
        super();
        this.minCount = minCount;
        this.percentOff = percentOff;
        this.targetTags = new Set(targetTags);
        this.name = `滿件折扣 - 2`;
        this.note = `指定商品滿 ${minCount} 件打 ${(10 - percentOff) / 10} 折`;
    }
    *process(cart) {
        let matchedProducts = [];
        let tag;
        for (let item of cart.purchasedItems) {
            // make intersection between targetTags and item's tags
            let intersection = new Set([...item.tags].filter((tag) => {
                return this.targetTags.has(tag);
            }));
            // if the item has the tag matches this discount
            if (intersection.size === 1) {
                if (!item.tags.has(tag)) {
                    matchedProducts.splice(0);
                    tag = intersection.values().next().value;
                }
                matchedProducts.push(item);
                if (matchedProducts.length === this.minCount) {
                    let amount = new decimal_js_1.default(0);
                    matchedProducts.forEach((product) => {
                        amount = amount.plus(product.price);
                    });
                    yield new Discount(amount.mul(this.percentOff).div(100), [...matchedProducts], this);
                    matchedProducts.splice(0);
                }
            }
            if (intersection.size > 1) {
                throw Error(`more than one tags in the same product match the discount rule`);
            }
        }
    }
}
exports.SelectedItemsGetXPercentOff = SelectedItemsGetXPercentOff;
// 同商品第 X 件 Y 元
class theSameItemsGetNthPriceY extends RuleBase {
    constructor(targetTags, minCount, price) {
        super();
        this.minCount = minCount;
        this.price = price;
        this.targetTags = new Set(targetTags);
        this.name = `滿件折扣 - 3`;
        this.note = `同商品第 ${minCount} 件 ${price} 元`;
    }
    *process(cart) {
        // create tags Map, only contains tags applied this rule.
        let tagsMap = new Map();
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
            const matchedItems = [];
            let sku;
            itemsHasTargetTag.sort((a, b) => {
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
                    yield new Discount(item.price.minus(this.price), [...matchedItems], this);
                    matchedItems.splice(0);
                }
            }
        }
    }
}
exports.theSameItemsGetNthPriceY = theSameItemsGetNthPriceY;
//# sourceMappingURL=Discount.js.map