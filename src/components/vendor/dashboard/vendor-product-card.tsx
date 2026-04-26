import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface VendorProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  stock: number;
  image: string;
  isAvailable: boolean;
  addedAt: string;
  discount?: number;
}

interface VendorProductCardProps {
  product: VendorProduct;
  viewMode: "card" | "list";
}

const VendorProductCard = ({ product, viewMode }: VendorProductCardProps) => {
  if (viewMode === "list") {
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-border-muted hover:shadow-sm transition-shadow">
        <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden">
          {product.discount && (
            <span className="absolute top-1 left-1 bg-content-warning text-white text-[10px] font-medium px-1.5 py-0.5 rounded z-10">
              {product.discount}% off
            </span>
          )}
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-content-neutral-primary truncate">{product.name}</p>
          <p className="text-xs text-content-neutral-muted truncate">{product.description}</p>
          <p className="text-xs text-content-neutral-tertiary mt-0.5">{product.category}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-medium ${product.isAvailable ? "text-surface-brand" : "text-content-negative"}`}>
            {product.isAvailable ? "✓ Available" : "⚠ Out of Stock"}
          </span>
          <span className="text-xs text-surface-forest font-semibold">{product.price}</span>
          <span className="text-[11px] text-content-neutral-muted">{product.stock} in stock</span>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 text-xs rounded-full border-border-muted">
          Edit Item?
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-xl border border-border-muted overflow-hidden hover:shadow-sm transition-shadow">
      <div className="relative w-full aspect-[4/3]">
        {product.discount && (
          <span className="absolute top-2 left-2 bg-content-warning text-white text-xs font-medium px-2 py-0.5 rounded z-10">
            {product.discount}% off
          </span>
        )}
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-2 p-3">
        <p className="text-sm font-medium text-content-neutral-primary leading-tight line-clamp-1">{product.name}</p>
        <p className="text-xs text-content-neutral-muted line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${product.isAvailable ? "text-surface-brand" : "text-content-negative"}`}>
            {product.isAvailable ? "✓ Available" : "⚠ Out of Stock"}
          </span>
          <span className="text-xs text-surface-forest font-semibold">{product.price}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-content-neutral-muted">
          <span>{product.category}</span>
          <span>Added {product.addedAt}</span>
        </div>
        <span className={`text-xs font-medium ${product.stock === 0 ? "text-content-negative" : "text-surface-brand"}`}>
          {product.stock === 0 ? "0 in stock" : `${product.stock} in stock`}
        </span>
        <Button variant="outline" size="sm" className="text-xs rounded-full border-border-muted mt-1">
          Edit Item?
        </Button>
      </div>
    </div>
  );
};

export default VendorProductCard;
