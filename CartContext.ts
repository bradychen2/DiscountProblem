import Decimal from "decimal.js";
import { Discount } from "./Discount";
import { Product } from "./Product";

export class CartContext {
  public readonly purchasedItems: Product[];
  public readonly appliedDiscounts: Discount[];
  public totalPrice: Decimal;
  constructor() {
    this.purchasedItems = [];
    this.appliedDiscounts = [];
    this.totalPrice = new Decimal(0);
  }
}
