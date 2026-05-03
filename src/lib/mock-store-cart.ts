export interface MockCartLine {
  id: string;
  name: string;
  variant: string;
  storeName: string;
  unitPrice: number;
  qty: number;
  imageSrc: string;
}

export const MOCK_CART_LINES: MockCartLine[] = [
  {
    id: "line-1",
    name: "Organic whole milk",
    variant: "1 L · Full cream",
    storeName: "Fresh Basket Market",
    unitPrice: 1850,
    qty: 2,
    imageSrc: "/images/landing/vendor/vendor-hero-1.png",
  },
  {
    id: "line-2",
    name: "Sourdough loaf",
    variant: "Large · Baked today",
    storeName: "Artisan Bakery Co.",
    unitPrice: 2400,
    qty: 1,
    imageSrc: "/images/landing/vendor/vendor-hero-2.png",
  },
  {
    id: "line-3",
    name: "Free-range eggs",
    variant: "12 pack · Medium",
    storeName: "Fresh Basket Market",
    unitPrice: 2100,
    qty: 1,
    imageSrc: "/images/landing/vendor/vendor-hero-3.png",
  },
];

export const MOCK_DELIVERY_FEE = 800;
export const MOCK_SERVICE_FEE = 350;
