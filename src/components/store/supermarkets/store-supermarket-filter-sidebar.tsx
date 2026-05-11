"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { STORE_CATEGORIES_QUERY_KEY, fetchStoreCategories } from "@/services/store/categories.api";
import {
  fetchAllVendorsInCategory,
  vendorsAllInCategoryQueryKey,
} from "@/services/store/vendors.api";
import { cn } from "@/lib/utils";

function parseCategoryIdsParam(raw: string | null): Set<string> {
  if (!raw?.trim()) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function StoreSupermarketFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spKey = searchParams.toString();

  const [vendorId, setVendorId] = React.useState("");
  const [categoryIds, setCategoryIds] = React.useState<Set<string>>(() => new Set());
  const [priceMin, setPriceMin] = React.useState("");
  const [priceMax, setPriceMax] = React.useState("");
  const [minRating, setMinRating] = React.useState("");
  const [discountOnly, setDiscountOnly] = React.useState(true);

  React.useEffect(() => {
    const sp = new URLSearchParams(spKey);
    setVendorId(sp.get("vendorId")?.trim() ?? "");
    setCategoryIds(parseCategoryIdsParam(sp.get("categoryIds")));
    setPriceMin(sp.has("priceMin") ? (sp.get("priceMin") ?? "") : "");
    setPriceMax(sp.has("priceMax") ? (sp.get("priceMax") ?? "") : "");
    setMinRating(sp.has("minRating") ? (sp.get("minRating") ?? "") : "");
    setDiscountOnly(!sp.has("discountOnly") || sp.get("discountOnly") === "true");
  }, [spKey]);

  const { data: catRes, isPending: catPending } = useQuery({
    queryKey: STORE_CATEGORIES_QUERY_KEY,
    queryFn: fetchStoreCategories,
  });

  const { data: vendors = [], isPending: vendorsPending } = useQuery({
    queryKey: vendorsAllInCategoryQueryKey("supermarket"),
    queryFn: () => fetchAllVendorsInCategory("supermarket"),
  });

  const categories =
    catRes?.success && Array.isArray(catRes.data)
      ? catRes.data.filter((c) => c.isActive)
      : [];

  const navigateWith = (next: URLSearchParams) => {
    router.push(`/store/supermarkets?${next.toString()}`);
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams.toString());
    if (!next.get("category")) next.set("category", "supermarket");
    if (!next.get("sort")) next.set("sort", "discountDesc");
    if (!next.get("limit")) next.set("limit", "12");

    if (vendorId.trim()) next.set("vendorId", vendorId.trim());
    else next.delete("vendorId");

    if (categoryIds.size > 0) next.set("categoryIds", [...categoryIds].join(","));
    else next.delete("categoryIds");

    const pMin = priceMin.trim();
    const pMax = priceMax.trim();
    if (pMin) next.set("priceMin", pMin);
    else next.delete("priceMin");
    if (pMax) next.set("priceMax", pMax);
    else next.delete("priceMax");

    const mr = minRating.trim();
    if (mr) next.set("minRating", mr);
    else next.delete("minRating");

    next.set("discountOnly", discountOnly ? "true" : "false");
    navigateWith(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    next.set("category", "supermarket");
    next.set("sort", "discountDesc");
    next.set("limit", "12");
    next.set("discountOnly", "true");
    navigateWith(next);
  };

  const toggleCategory = (id: string) => {
    setCategoryIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <div className="w-64 shrink-0 border-r border-border-subtle bg-surface-canvas p-6">
      <h2 className="mb-5 text-base font-semibold text-content-neutral-primary md:text-lg">
        Filter by
      </h2>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-content-neutral-secondary md:text-base">
          Supermarket
        </h3>
        <p className="mb-3 text-xs text-content-neutral-muted">
          Choose one store or leave &quot;All&quot; for every supermarket vendor.
        </p>
        {vendorsPending ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-content-neutral-tertiary hover:bg-surface-subtle"
              )}
            >
              <input
                type="radio"
                name="supermarket-vendor"
                className="size-4 accent-primary"
                checked={vendorId === ""}
                onChange={() => setVendorId("")}
              />
              <span>All supermarkets</span>
            </label>
            {vendors.map((v) => (
              <label
                key={v._id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-content-neutral-tertiary hover:bg-surface-subtle"
              >
                <input
                  type="radio"
                  name="supermarket-vendor"
                  className="size-4 accent-primary"
                  checked={vendorId === v._id}
                  onChange={() => setVendorId(v._id)}
                />
                <span className="truncate">{v.businessName}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-content-neutral-secondary md:text-base">
          Categories
        </h3>
        {catPending ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full rounded-md" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-xs text-content-neutral-muted">No categories returned.</p>
        ) : (
          <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
            {categories.map((c) => (
              <Label key={c._id} className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={categoryIds.has(c._id)}
                  onCheckedChange={() => toggleCategory(c._id)}
                  className="h-5 w-5"
                />
                <span className="text-sm font-light text-content-neutral-tertiary">{c.name}</span>
              </Label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-content-neutral-secondary md:text-base">
          Price (₦)
        </h3>
        <div className="space-y-2">
          <Label className="text-xs text-content-neutral-muted">Min</Label>
          <Input
            inputMode="numeric"
            placeholder="e.g. 1000"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value.replace(/\D/g, ""))}
            className="h-9"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-content-neutral-muted">Max</Label>
          <Input
            inputMode="numeric"
            placeholder="e.g. 10000"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ""))}
            className="h-9"
          />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <Label className="text-xs text-content-neutral-muted">Minimum rating (optional)</Label>
        <Input
          inputMode="decimal"
          placeholder="e.g. 4"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value.replace(/[^\d.]/g, ""))}
          className="h-9"
        />
      </div>

      <div className="mb-6">
        <Label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={discountOnly}
            onCheckedChange={(v) => setDiscountOnly(v === true)}
            className="h-5 w-5"
          />
          <span className="text-sm text-content-neutral-tertiary">Discounted items only</span>
        </Label>
      </div>

      <div className="flex flex-col gap-2 border-t border-border-subtle pt-4">
        <Button type="button" className="w-full rounded-full" onClick={applyFilters}>
          Apply filters
        </Button>
        <Button type="button" variant="outline" className="w-full rounded-full" onClick={clearFilters}>
          Clear all
        </Button>
      </div>
    </div>
  );
}
