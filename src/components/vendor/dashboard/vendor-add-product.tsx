"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelectField } from "@/components/vendor/shared/form-select-field";
import { fetchStoreCategories, STORE_CATEGORIES_QUERY_KEY } from "@/services/store/categories.api";
import {
  fetchVendorProductCategories,
  vendorProductCategoriesQueryKey,
} from "@/services/vendor/vendor-product-categories.api";
import {
  createVendorProduct,
  vendorProductsQueryKey,
} from "@/services/vendor/vendor-products.api";

const inputCls =
  "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm placeholder:text-content-neutral-muted px-3";

const VendorAddProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const imgRef = useRef<HTMLInputElement>(null);
  const [inStock, setInStock] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    asapuCategoryId: "",
    vendorCategoryId: "",
    price: "",
    quantity: "0",
  });

  const { data: asapuCategoriesRes } = useQuery({
    queryKey: STORE_CATEGORIES_QUERY_KEY,
    queryFn: fetchStoreCategories,
  });

  const { data: vendorCategoriesRes } = useQuery({
    queryKey: vendorProductCategoriesQueryKey,
    queryFn: fetchVendorProductCategories,
  });

  const asapuOptions =
    asapuCategoriesRes?.data?.map((c) => ({ value: c._id, label: c.name })) ?? [];
  const vendorOptions =
    vendorCategoriesRes?.data?.map((c) => ({ value: c.id, label: c.name })) ?? [];

  const set = (key: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createVendorProduct(
        {
          name: form.name.trim(),
          description: form.description.trim(),
          categoryIds: [form.asapuCategoryId],
          vendorCategoryId: form.vendorCategoryId,
          price: Number(form.price),
          cost: Number(form.price),
          quantity: Number(form.quantity),
          trackQuantity: true,
          status: inStock ? "active" : "out_of_stock",
        },
        images
      ),
    onSuccess: (res) => {
      toast.success(res.message ?? "Product created");
      void queryClient.invalidateQueries({ queryKey: vendorProductsQueryKey });
      router.push("/vendor/dashboard");
    },
    onError: () => toast.error("Could not create product"),
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    if (!form.asapuCategoryId) {
      toast.error("Select an ASAPU product category");
      return;
    }
    if (!form.vendorCategoryId) {
      toast.error("Select a vendor product category");
      return;
    }
    if (vendorOptions.length === 0) {
      toast.error("Add a vendor category first", {
        description: "Create menu tabs before adding products.",
      });
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary mb-6">
        Add Product
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <h2 className="text-sm font-semibold text-content-neutral-primary">Category & pricing</h2>

            <FormSelectField
              id="asapu-category"
              label="ASAPU product category"
              hint="Platform taxonomy used for search and discovery across ASAPU."
              value={form.asapuCategoryId}
              onValueChange={(v) => set("asapuCategoryId", v)}
              options={asapuOptions}
              placeholder="Select ASAPU category"
            />

            <FormSelectField
              id="vendor-category"
              label="Vendor product category"
              hint={
                vendorOptions.length === 0
                  ? "You need at least one vendor category — add them under Add Vendor Category."
                  : "Shown as menu tabs on your storefront."
              }
              value={form.vendorCategoryId}
              onValueChange={(v) => set("vendorCategoryId", v)}
              options={vendorOptions}
              placeholder={
                vendorOptions.length === 0 ? "No vendor categories yet" : "Select your category"
              }
              disabled={vendorOptions.length === 0}
            />

            {vendorOptions.length === 0 ? (
              <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
                <Link href="/vendor/dashboard/add-categories">Add vendor category</Link>
              </Button>
            ) : null}

            <div className="space-y-1.5">
              <Label className="text-sm text-content-neutral-secondary">Product Price (₦)</Label>
              <Input
                type="number"
                min={0}
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
                min={0}
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
              <span className="text-sm text-content-neutral-secondary">In stock</span>
            </label>
            <p className="text-xs text-content-neutral-muted -mt-2">Uncheck if out of stock</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-border-muted p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-content-neutral-primary">Product images</h2>
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
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImages}
            />
            {images.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {images.map((f, i) => (
                  <span
                    key={i}
                    className="text-xs bg-surface-subtle px-2 py-1 rounded-lg text-content-neutral-secondary"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Button
          className="bg-surface-brand hover:bg-surface-brand/90 rounded-lg px-6"
          disabled={createMutation.isPending}
          onClick={handleSubmit}
        >
          {createMutation.isPending ? "Adding…" : "Add product"}
        </Button>
        <Button asChild variant="ghost" className="rounded-lg px-6 text-content-neutral-muted">
          <Link href="/vendor/dashboard">Cancel</Link>
        </Button>
      </div>
    </div>
  );
};

export default VendorAddProduct;
