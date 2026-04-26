"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, SquaresFourIcon, ListIcon, FunnelIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VendorStatCard from "./vendor-stat-card";
import VendorProductCard, { type VendorProduct } from "./vendor-product-card";

const mockProducts: VendorProduct[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: i % 3 === 0 ? "Banana Bunch" : "Chicken Breast",
  description: i % 3 === 0
    ? "Sweet and ripe bananas, rich in potassium and natural sugars. Great"
    : "Fresh chicken breast, boneless and skinless. Perfect for grilling, frying, or",
  category: i % 3 === 0 ? "Fruits & Vegetables" : "Meat & Fish",
  price: i % 3 === 0 ? "N 2,500/KG" : "N 3,500/KG",
  stock: i % 3 === 0 ? 0 : 120,
  image: "/images/landing/pepper.png",
  isAvailable: i % 3 !== 0,
  addedAt: "10/09/25",
  discount: 20,
}));

const ITEMS_PER_PAGE = 6;

const VendorDashboard = () => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-content-neutral-primary">Dashboard</h1>

      {/* Stats */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">Product Dashboard</h2>
          <button className="text-xs sm:text-sm text-surface-brand hover:underline cursor-pointer">See all reports</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <VendorStatCard label="Total Products" value={124} icon="/icons/vendor/icon-total-products.svg" iconBg="bg-blue-50" valueColor="text-surface-brand" />
          <VendorStatCard label="Low Stock" value={124} icon="/icons/vendor/icon-low-stock.svg" iconBg="bg-yellow-50" valueColor="text-[#DEB721]" />
          <VendorStatCard label="Out of Stock" value={124} icon="/icons/vendor/icon-out-of-stock.svg" iconBg="bg-red-50" valueColor="text-[#DE2124]" />
          <VendorStatCard label="Inventory Value" value={124} icon="/icons/vendor/icon-naira.svg" iconBg="bg-green-50" valueColor="text-surface-brand" />
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">Filter &amp; Search Products</h2>
          <span className="text-xs sm:text-sm text-content-neutral-muted">Showing {filtered.length} by {mockProducts.length} Products</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-content-neutral-muted pointer-events-none" />
            <Input
              placeholder="Search Asap you"
              className="pl-9 h-10 rounded-lg border-border-muted bg-white text-sm"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 rounded-lg border border-border-muted bg-white px-3 text-sm text-content-neutral-secondary min-w-[130px]">
              <option>Select Category</option>
              <option>Fruits &amp; Vegetables</option>
              <option>Meat &amp; Fish</option>
            </select>
            <select className="h-10 rounded-lg border border-border-muted bg-white px-3 text-sm text-content-neutral-secondary min-w-[130px]">
              <option>Select Category</option>
              <option>Available</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product list header with view toggle */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-medium text-content-neutral-primary">Filter &amp; Search Products</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 gap-1.5 text-xs border-border-muted">
              <FunnelIcon className="size-3.5" /> Filter
            </Button>
            <div className="flex border border-border-muted rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 transition-colors cursor-pointer ${viewMode === "card" ? "bg-surface-brand text-white" : "bg-white text-content-neutral-muted hover:bg-surface-muted"}`}
                aria-label="Card view"
              >
                <SquaresFourIcon className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors cursor-pointer ${viewMode === "list" ? "bg-surface-brand text-white" : "bg-white text-content-neutral-muted hover:bg-surface-muted"}`}
                aria-label="List view"
              >
                <ListIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={viewMode === "card" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {paginated.map((p) => (
            <VendorProductCard key={p.id} product={p} viewMode={viewMode} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-content-neutral-muted">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 rounded-full text-xs font-medium transition-colors cursor-pointer ${page === i + 1 ? "bg-surface-brand text-white" : "bg-white border border-border-muted text-content-neutral-secondary hover:bg-surface-muted"}`}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(p + 1, totalPages))} className="text-xs h-7 px-3">Next →</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
