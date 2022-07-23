import { Decimal } from "decimal.js";

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: Decimal;
  tags: Set<string>;
  tagsValue(): string;
}

export class Product implements Product {
  public id: number;
  public sku: string;
  public name: string;
  public price: Decimal;

  constructor(
    id: number,
    sku: string,
    name: string,
    price: Decimal,
    tags: Array<string>
  ) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.tags = new Set(tags);
  }

  tagsValue(): string {
    if (this.tags === null || this.tags.size === 0) return "";
    const tagsValue: Array<string> = [];
    this.tags.forEach((t) => tagsValue.push("#" + t));
    return tagsValue.join(",");
  }
}
