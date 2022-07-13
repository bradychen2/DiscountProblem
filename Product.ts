import { Decimal } from "decimal.js";

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: Decimal;
  // tags: Map<string, string>;
}

export class Product implements Product {
  public id: number;
  public sku: string;
  public name: string;
  public price: Decimal;

  constructor(id: number, sku: string, name: string, price: Decimal) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price = price;
  }
}
