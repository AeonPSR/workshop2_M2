import {
  getPrice,
  addItem,
  removeItem,
  setItemQty,
  revalidateCart,
  cartCount,
} from "@/lib/cart";

const products = [
  { id: 1, name: "Confiture", stock: 3, price_particulier: 5, price_pro: 4 },
  { id: 2, name: "Miel", stock: 0, price_particulier: 8, price_pro: 6 },
  { id: 3, name: "Bière", stock: 10, price_particulier: 3, price_pro: null },
];

describe("getPrice", () => {
  it("uses the particulier price for a non-pro visitor", () => {
    expect(getPrice(products[0], false)).toBe(5);
  });

  it("uses the pro price for a pro account", () => {
    expect(getPrice(products[0], true)).toBe(4);
  });

  it("falls back to the particulier price when no pro price is set", () => {
    expect(getPrice(products[2], true)).toBe(3);
  });
});

describe("addItem", () => {
  it("adds a new product with the requested quantity", () => {
    const cart = addItem([], products, 1, 2);
    expect(cart).toEqual([{ id: 1, qty: 2 }]);
  });

  it("caps the quantity to the available stock", () => {
    const cart = addItem([], products, 1, 5); // stock is 3
    expect(cart).toEqual([{ id: 1, qty: 3 }]);
  });

  it("accumulates on an existing line, still capped to stock", () => {
    const cart = addItem([{ id: 1, qty: 2 }], products, 1, 5); // 2 + 5 > stock 3
    expect(cart).toEqual([{ id: 1, qty: 3 }]);
  });

  it("refuses to add a product that is out of stock", () => {
    const cart = addItem([], products, 2, 1); // stock is 0
    expect(cart).toEqual([]);
  });

  it("does not touch other lines already in the cart", () => {
    const cart = addItem([{ id: 3, qty: 1 }], products, 1, 1);
    expect(cart).toEqual([
      { id: 3, qty: 1 },
      { id: 1, qty: 1 },
    ]);
  });
});

describe("removeItem", () => {
  it("removes the matching line", () => {
    const cart = removeItem(
      [
        { id: 1, qty: 1 },
        { id: 3, qty: 2 },
      ],
      1,
    );
    expect(cart).toEqual([{ id: 3, qty: 2 }]);
  });

  it("is a no-op when the id is not in the cart", () => {
    const initial = [{ id: 3, qty: 2 }];
    expect(removeItem(initial, 999)).toEqual(initial);
  });
});

describe("setItemQty", () => {
  it("sets the quantity within the stock limit", () => {
    const cart = setItemQty([{ id: 1, qty: 1 }], products, 1, 2);
    expect(cart).toEqual([{ id: 1, qty: 2 }]);
  });

  it("clamps the quantity to the available stock", () => {
    const cart = setItemQty([{ id: 1, qty: 1 }], products, 1, 99); // stock is 3
    expect(cart).toEqual([{ id: 1, qty: 3 }]);
  });

  it("removes the line when the quantity drops to 0 or below", () => {
    const cart = setItemQty([{ id: 1, qty: 1 }], products, 1, 0);
    expect(cart).toEqual([]);
  });
});

describe("revalidateCart", () => {
  it("clamps a line whose quantity now exceeds current stock", () => {
    const cart = revalidateCart([{ id: 1, qty: 10 }], products); // stock is 3
    expect(cart).toEqual([{ id: 1, qty: 3 }]);
  });

  it("drops a line whose product sold out", () => {
    const cart = revalidateCart([{ id: 2, qty: 1 }], products); // stock is 0
    expect(cart).toEqual([]);
  });

  it("drops a line whose product no longer exists", () => {
    const cart = revalidateCart([{ id: 999, qty: 1 }], products);
    expect(cart).toEqual([]);
  });

  it("returns the same array reference when nothing needs to change", () => {
    const initial = [{ id: 1, qty: 2 }, { id: 3, qty: 1 }];
    expect(revalidateCart(initial, products)).toBe(initial);
  });

  it("does not wipe the cart while products have not loaded yet", () => {
    const initial = [{ id: 1, qty: 2 }];
    expect(revalidateCart(initial, [])).toBe(initial);
  });
});

describe("cartCount", () => {
  it("sums the quantities across all lines", () => {
    expect(cartCount([{ id: 1, qty: 2 }, { id: 3, qty: 5 }])).toBe(7);
  });

  it("is 0 for an empty cart", () => {
    expect(cartCount([])).toBe(0);
  });
});
