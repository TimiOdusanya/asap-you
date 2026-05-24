"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  SquaresFourIcon,
  ListIcon,
  FunnelIcon,
  WarningCircle,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import VendorStatCard from "./vendor-stat-card";
import VendorProductCard from "./vendor-product-card";
import { VendorDashboardSkeleton } from "./vendor-dashboard-skeleton";
import {
  fetchVendorProducts,
  vendorProductsQueryKey,
} from "@/services/vendor/vendor-products.api";
import {
  formatInventoryValue,
  mapVendorProductDtoToCard,
} from "@/lib/map-vendor-product";

const ITEMS_PER_PAGE = 6;

type AvailabilityFilter = "all" | "available" | "out_of_stock";

const VendorDashboard = () => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: vendorProductsQueryKey,
    queryFn: fetchVendorProducts,
  });

  const products = useMemo(
    () => (data?.data ?? []).map(mapVendorProductDtoToCard),
    [data?.data]
  );

  const categories = useMemo(() => {
    const names = new Set<string>();
    for (const product of products) {
      if (product.category) names.add(product.category);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && product.isAvailable) ||
        (availabilityFilter === "out_of_stock" && !product.isAvailable);
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, categoryFilter, availabilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const stats = data?.stats;

  if (isPending) {
    return <VendorDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 p-8 text-center">
        <WarningCircle className="size-10 text-red-400" />
        <p className="font-semibold text-content-neutral-primary">Failed to load dashboard</p>
        <p className="text-sm text-content-neutral-secondary">
          We couldn&apos;t fetch your products. Check your connection and try again.
        </p>
        <Button onClick={() => refetch()} className="rounded-full">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Dashboard</h1>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">
            Product Dashboard
          </h2>
          <Link
            href="/vendor/dashboard/add-product"
            className="text-xs sm:text-sm text-surface-brand hover:underline"
          >
            Add product
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <VendorStatCard
            label="Total Products"
            value={stats?.totalProducts ?? 0}
            icon="/icons/vendor/icon-total-products.svg"
            iconBg="bg-blue-50"
            valueColor="text-surface-brand"
          />
          <VendorStatCard
            label="Low Stock"
            value={stats?.lowStock ?? 0}
            icon="/icons/vendor/icon-low-stock.svg"
            iconBg="bg-yellow-50"
            valueColor="text-[#DEB721]"
          />
          <VendorStatCard
            label="Out of Stock"
            value={stats?.outOfStock ?? 0}
            icon="/icons/vendor/icon-out-of-stock.svg"
            iconBg="bg-red-50"
            valueColor="text-[#DE2124]"
          />
          <VendorStatCard
            label="Inventory Value"
            value={formatInventoryValue(stats?.inventoryValue ?? 0)}
            icon="/icons/vendor/icon-naira.svg"
            iconBg="bg-green-50"
            valueColor="text-surface-brand"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">
            Filter &amp; Search Products
          </h2>
          <span className="text-xs sm:text-sm text-content-neutral-muted">
            Showing {filtered.length} of {products.length} products
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-neutral-muted pointer-events-none" />
            <Input
              placeholder="Search products"
              className="pl-9 h-10 rounded-lg border-border-muted bg-white text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="h-10 rounded-lg border border-border-muted bg-white px-3 text-sm text-content-neutral-secondary min-w-[130px]"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-lg border border-border-muted bg-white px-3 text-sm text-content-neutral-secondary min-w-[130px]"
              value={availabilityFilter}
              onChange={(e) => {
                setAvailabilityFilter(e.target.value as AvailabilityFilter);
                setPage(1);
              }}
            >
              <option value="all">All availability</option>
              <option value="available">Available</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">Your products</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 gap-1.5 text-xs border-border-muted">
              <FunnelIcon className="size-3.5" /> Filter
            </Button>
            <div className="flex border border-border-muted rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`p-2 transition-colors cursor-pointer ${viewMode === "card" ? "bg-surface-brand text-white" : "bg-white text-content-neutral-muted hover:bg-surface-muted"}`}
                aria-label="Card view"
              >
                <SquaresFourIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors cursor-pointer ${viewMode === "list" ? "bg-surface-brand text-white" : "bg-white text-content-neutral-muted hover:bg-surface-muted"}`}
                aria-label="List view"
              >
                <ListIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first product to start selling on Asap You."
            action={{
              label: "Add product",
              href: "/vendor/dashboard/add-product",
            }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching products"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div
            className={
              viewMode === "card"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {paginated.map((product) => (
              <VendorProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}

        {totalPages > 1 && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-content-neutral-muted">
              Page {safePage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-full text-xs font-medium transition-colors cursor-pointer ${safePage === i + 1 ? "bg-surface-brand text-white" : "bg-white border border-border-muted text-content-neutral-secondary hover:bg-surface-muted"}`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="text-xs h-7 px-3"
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
