export interface PriceRange {
  min: number;
  max: number;
}

export class GenericHelper {
  static parsePrice(value: string): number {
    const normalized = value.replace(/[^\d.]/g, "");
    const price = Number(normalized);
    if (!Number.isFinite(price) || normalized.length === 0) {
      throw new Error(`Could not parse a price from "${value}"`);
    }
    return price;
  }

  static assertPriceInRange(price: number, range: PriceRange): void {
    if (price < range.min || price > range.max) {
      throw new Error(`Price ₹${price} is outside the expected range ₹${range.min}-₹${range.max}`);
    }
  }
}
