import Decimal from "decimal.js";
import { CartContext } from "./CartContext";
import { RuleBase } from "./Discount";

export class POS {
  public readonly activeRules: RuleBase[] = [];
  public checkoutProcess(cart: CartContext): boolean {
    // reset cart
    cart.appliedDiscounts.splice(0);
    // original total price of items in the cart
    cart.purchasedItems.forEach((item) => {
      cart.totalPrice = cart.totalPrice.plus(item.price);
    });

    this.activeRules.forEach((rule) => {
      const discounts = rule.process(cart);
      cart.appliedDiscounts.push(...Array.from(discounts));

      // total discount amount
      let totalDiscount: Decimal = new Decimal(0);
      cart.appliedDiscounts.forEach((discount) => {
        totalDiscount = totalDiscount.plus(discount.amount);
      });
      // original total price - total discount amount
      cart.totalPrice = cart.totalPrice.minus(totalDiscount);
    });
    return true;
  }
}
