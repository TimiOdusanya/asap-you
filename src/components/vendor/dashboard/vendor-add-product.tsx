"use client";

import React, { useRef, useState } from "react";
import { ImageIcon, DownloadSimpleIcon, CheckIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const inputCls =
  "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm placeholder:text-content-neutral-muted px-3";

const VendorAddProduct = () => {
  const imgRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "0.00",
    quantity: "0",
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary mb-6">Add Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Description + Category */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-content-neutral-primary">Description</h2>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Product Name</Label>
              <Input
                placeholder="e.g, Tatashe"
                className={inputCls}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Product Description</Label>
              <textarea
                placeholder="Brief description of your product"
                rows={3}
                className="w-full rounded-lg border border-border-muted bg-surface-subtle text-sm placeholder:text-content-neutral-muted px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-surface-brand"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-content-neutral-primary">Category</h2>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Product Category</Label>
              <select
                className="w-full h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm text-content-neutral-secondary px-3"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="fruits">Fruits &amp; Vegetables</option>
                <option value="meat">Meat &amp; Fish</option>
                <option value="dairy">Dairy &amp; Eggs</option>
                <option value="bakery">Bakery</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Product Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                className={inputCls}
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Stock Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                className={inputCls}
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                checked={inStock}
                onCheckedChange={(v) => setInStock(Boolean(v))}
                className="data-[state=checked]:bg-surface-brand data-[state=checked]:border-surface-brand"
              />
              <span className="text-sm text-content-neutral-secondary">Stock Quantity</span>
            </label>
            <p className="text-xs text-content-neutral-muted -mt-2">Uncheck if out of stock</p>
          </div>
        </div>

        {/* Right: Images + CSV */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-content-neutral-primary">Product Image</h2>
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              className="w-full border-2 border-dashed border-border-muted rounded-xl p-8 flex flex-col items-center gap-3 hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <ImageIcon className="size-8 text-content-neutral-muted" />
              <p className="text-xs sm:text-sm text-center text-content-neutral-muted">
                Drop your images or{" "}
                <span className="text-surface-brand underline">click to browse</span>
              </p>
              <p className="text-xs text-content-neutral-muted">Up to 5 files, max 5MB each</p>
            </button>
            <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((f, i) => (
                  <span key={i} className="text-xs bg-surface-subtle px-2 py-1 rounded-lg text-content-neutral-secondary">{f.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-content-neutral-primary">Product Image</h2>
            <button
              type="button"
              onClick={() => csvRef.current?.click()}
              className="w-full border-2 border-dashed border-border-muted rounded-xl p-8 flex flex-col items-center gap-3 hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <ImageIcon className="size-8 text-content-neutral-muted" />
              <p className="text-xs sm:text-sm text-center text-content-neutral-muted">
                Drop CSV file here or{" "}
                <span className="text-surface-brand underline">click to browse</span>
              </p>
              <p className="text-xs text-content-neutral-muted">CSV file up to 100</p>
            </button>
            <input ref={csvRef} type="file" accept=".csv" className="hidden" />
          </div>

          <div className="bg-white rounded-xl border border-border-muted p-4 flex items-center gap-3">
            <DownloadSimpleIcon className="size-5 text-content-neutral-muted shrink-0" />
            <div>
              <p className="text-sm font-medium text-content-neutral-primary">Need a template?</p>
              <p className="text-xs text-surface-brand hover:underline cursor-pointer">Download our CSV template to get started</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button className="bg-surface-brand hover:bg-surface-brand/90 rounded-lg px-6">Add Product</Button>
        <Button variant="outline" className="rounded-lg px-6 border-border-muted">Save Product</Button>
        <Button variant="ghost" className="rounded-lg px-6 text-content-neutral-muted">Discard</Button>
      </div>
    </div>
  );
};

export default VendorAddProduct;
