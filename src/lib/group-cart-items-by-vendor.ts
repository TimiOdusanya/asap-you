import type { CartItemDto } from "@/types/store-api";

export interface CartVendorGroup {
  vendorId: string;
  items: CartItemDto[];
  subtotal: number;
  itemCount: number;
}

export function groupCartItemsByVendor(items: CartItemDto[]): CartVendorGroup[] {
  const order: string[] = [];
  const map = new Map<string, CartItemDto[]>();

  for (const item of items) {
    const id = item.vendorId;
    if (!map.has(id)) {
      map.set(id, []);
      order.push(id);
    }
    map.get(id)!.push(item);
  }

  return order.map((vendorId) => {
    const groupItems = map.get(vendorId) ?? [];
    return {
      vendorId,
      items: groupItems,
      subtotal: groupItems.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: groupItems.reduce((n, i) => n + i.quantity, 0),
    };
  });
}
