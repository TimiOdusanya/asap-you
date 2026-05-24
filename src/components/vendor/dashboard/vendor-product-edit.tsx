"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchVendorProductById,
  updateVendorProduct,
  vendorProductDetailQueryKey,
  vendorProductsQueryKey,
} from "@/services/vendor/vendor-products.api";
import { fetchStoreCategories, STORE_CATEGORIES_QUERY_KEY } from "@/services/store/categories.api";
import {
  fetchVendorProductCategories,
  vendorProductCategoriesQueryKey,
} from "@/services/vendor/vendor-product-categories.api";
import { FormSelectField } from "@/components/vendor/shared/form-select-field";

const inputCls =
  "h-10 rounded-lg border border-border-muted bg-surface-subtle text-sm px-3";

function ProductEditSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6" role="status" aria-label="Loading product">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}

export function VendorProductEdit({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: vendorProductDetailQueryKey(productId),
    queryFn: () => fetchVendorProductById(productId),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: STORE_CATEGORIES_QUERY_KEY,
    queryFn: fetchStoreCategories,
  });

  const { data: vendorCategoriesRes } = useQuery({
    queryKey: vendorProductCategoriesQueryKey,
    queryFn: fetchVendorProductCategories,
  });

  const product = data?.data;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("5");
  const [status, setStatus] = useState<"active" | "inactive" | "out_of_stock">("active");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [vendorCategoryId, setVendorCategoryId] = useState("");
  const [trackQuantity, setTrackQuantity] = useState(true);

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setQuantity(String(product.inventory.quantity));
    setLowStockAlert(String(product.inventory.lowStockAlert));
    setStatus(product.status as "active" | "inactive" | "out_of_stock");
    setCategoryIds(product.categoryIds ?? []);
    setVendorCategoryId(
      typeof product.vendorCategoryId === "string" ? product.vendorCategoryId : ""
    );
    setTrackQuantity(product.inventory.trackQuantity);
  }, [product]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateVendorProduct(productId, {
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        lowStockAlert: Number(lowStockAlert),
        status,
        categoryIds,
        vendorCategoryId: vendorCategoryId || undefined,
        trackQuantity,
      }),
    onSuccess: (res) => {
      toast.success(res.message ?? "Product updated");
      queryClient.invalidateQueries({ queryKey: vendorProductsQueryKey });
      queryClient.setQueryData(vendorProductDetailQueryKey(productId), {
        success: true,
        data: res.data,
      });
    },
    onError: () => toast.error("Could not update product"),
  });

  const markOutOfStockMutation = useMutation({
    mutationFn: () =>
      updateVendorProduct(productId, { status: "out_of_stock", quantity: 0 }),
    onSuccess: () => {
      toast.success("Marked as out of stock");
      setStatus("out_of_stock");
      setQuantity("0");
      queryClient.invalidateQueries({ queryKey: vendorProductsQueryKey });
      refetch();
    },
  });

  const categories = categoriesRes?.data ?? [];
  const vendorCategories = vendorCategoriesRes?.data ?? [];
  const asapuCategoryId = categoryIds[0] ?? "";

  const setAsapuCategory = (id: string) => setCategoryIds(id ? [id] : []);

  if (isPending) return <ProductEditSkeleton />;

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <WarningCircle className="size-10 text-red-400" />
        <p className="font-semibold text-content-neutral-primary">Product not found</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/vendor/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const imageSrc = product.images[0] ?? "/images/landing/pepper.png";

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/vendor/dashboard"
          className="inline-flex items-center gap-1 text-sm text-content-neutral-secondary hover:text-content-neutral-primary"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">
          Edit product
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-border-muted bg-white">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized={imageSrc.startsWith("http")}
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-muted p-5 sm:p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Product name</Label>
              <Input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-border-muted bg-surface-subtle text-sm px-3 py-2 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Price (₦)</Label>
              <Input type="number" min={0} className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Stock quantity</Label>
              <Input type="number" min={0} className={inputCls} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Low stock alert at</Label>
              <Input type="number" min={0} className={inputCls} value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} />
            </div>
            <FormSelectField
              id="edit-status"
              label="Status"
              value={status}
              onValueChange={(v) => setStatus(v as typeof status)}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "out_of_stock", label: "Out of stock" },
              ]}
            />
          </div>

          <FormSelectField
            id="edit-asapu-category"
            label="ASAPU product category"
            value={asapuCategoryId}
            onValueChange={setAsapuCategory}
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
            placeholder="Select ASAPU category"
          />

          <FormSelectField
            id="edit-vendor-category"
            label="Vendor product category"
            value={vendorCategoryId}
            onValueChange={setVendorCategoryId}
            options={vendorCategories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select your category"
          />

          <label className="flex items-center gap-2 text-sm text-content-neutral-secondary">
            <input
              type="checkbox"
              checked={trackQuantity}
              onChange={(e) => setTrackQuantity(e.target.checked)}
              className="accent-surface-brand"
            />
            Track inventory quantity
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="rounded-full bg-surface-brand hover:bg-surface-brand/90 px-8"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || categoryIds.length === 0 || !vendorCategoryId}
            >
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-border-muted"
              onClick={() => markOutOfStockMutation.mutate()}
              disabled={markOutOfStockMutation.isPending}
            >
              Mark out of stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
