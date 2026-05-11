'use client'

import React, { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import {  List, Filter, LayoutGrid, X, ArrowDown } from 'lucide-react'
import FilterSidebar from './FilterSidebar'
import ProductCard from './ProductCard'
import { Product } from './ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState, type EmptyStateAction } from '@/components/ui/empty-state'
import { ProductGridSkeleton } from '@/components/store/skeletons/product-grid-skeleton'
import { EMPTY_STATE_ILLUSTRATION } from '@/lib/empty-state-illustrations'

interface ProductListingPageProps {
  category: string
  products: Product[]
  breadcrumbs: string[]
  isLoading?: boolean
  emptyState?: {
    title: string
    description: string
    action?: EmptyStateAction
  }
  /** When set, hides the placeholder “active filter” chips (API-driven listings). */
  hideStubActiveFilters?: boolean
  /** Controlled sort value (API `sort` param). Requires `onSortChange`. */
  sortValue?: string
  onSortChange?: (value: string) => void
  sortOptions?: { value: string; label: string }[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  /** Route segment for product detail, e.g. `supermarket` → `/store/supermarket/:id */
  productPathSegment?: string
  /** Replaces the default filter sidebar (desktop + mobile drawer). */
  filterSidebar?: ReactNode
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({
  category,
  products,
  breadcrumbs,
  isLoading = false,
  emptyState,
  hideStubActiveFilters = false,
  sortValue: sortValueControlled,
  onSortChange,
  sortOptions: sortOptionsProp,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  productPathSegment,
  filterSidebar,
}) => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortByLocal, setSortByLocal] = useState("default")
  const [filteredProducts, setFilteredProducts] = useState(products)

  const sortControlled = Boolean(onSortChange && sortValueControlled !== undefined)
  const sortBy = sortControlled ? sortValueControlled! : sortByLocal
  const setSortBy = sortControlled
    ? (v: string) => {
        onSortChange?.(v)
      }
    : setSortByLocal

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const pathSegment = productPathSegment ?? category.toLowerCase()

  const handleProductClick = (product: Product) => {
    router.push(`/store/${pathSegment}/${product.id}`)
  }

  const handleFilterChange = (_filters: Record<string, unknown>) => {
    setFilteredProducts(products)
  }

  const handleClearAll = () => {
    setFilteredProducts(products)
  }

  const sortOptions = sortOptionsProp ?? [
    { value: "default", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
    { value: "newest", label: "Newest" },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-[95%] md:max-w-[90%] mx-auto">

        <div className="flex">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block">
            {filterSidebar ?? (
              <FilterSidebar
                category={category}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAll}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 py-6 lg:p-6">
             {/* Breadcrumbs */}
            <div className="bg-surface-canvas py-4 mb-6">
              <nav className="text-sm text-content-neutral-tertiary">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    <span className={index === breadcrumbs.length - 1 ? 'text-content-neutral-primary font-medium' : ''}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            </div>
            {/* Header Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden rounded-full text-sm"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-content-neutral-secondary whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px] rounded-full shadow-none cursor-pointer text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle — desktop only */}
              <div className="hidden lg:flex items-center gap-2 ml-auto">
                <span className="text-sm font-medium text-content-neutral-secondary">View:</span>
                <div className="flex rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none h-9 w-9"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none h-9 w-9"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filter Sidebar */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                {filterSidebar ?? (
                  <FilterSidebar
                    category={category}
                    onFilterChange={handleFilterChange}
                    onClearAll={handleClearAll}
                  />
                )}
              </div>
            )}

            {!hideStubActiveFilters && !isLoading && filteredProducts.length > 0 ? (
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-content-neutral-secondary">Active Filter</span>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-content-negative underline hover:text-content-warning sm:text-sm"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex cursor-pointer items-center rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground sm:text-sm">
                  Dailys <X className="ml-1" size={14}/>
                </span>
                <span className="inline-flex cursor-pointer items-center rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground sm:text-sm">
                  Dairy & Eggs <X className="ml-1" size={14}/>
                </span>
                <span className="inline-flex cursor-pointer items-center rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground sm:text-sm">
                  New Arrivals <X className="ml-1" size={14}/>
                </span>
              </div>
            </div>
            ) : null}

            {isLoading ? (
            <ProductGridSkeleton viewMode={viewMode} />
            ) : filteredProducts.length === 0 ? (
            <EmptyState
              illustrationSrc={EMPTY_STATE_ILLUSTRATION.store}
              illustrationAlt=""
              title={emptyState?.title ?? "No products found"}
              description={
                emptyState?.description ??
                "Try a different search or check back later for new arrivals."
              }
              action={emptyState?.action ?? { label: "Back to store", href: "/store" }}
            />
            ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
            )}

            {!isLoading &&
            filteredProducts.length > 0 &&
            (onLoadMore == null ? true : hasNextPage) ? (
            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                className="flex items-center gap-2 px-4"
                disabled={onLoadMore ? isFetchingNextPage || !hasNextPage : false}
                onClick={() => void onLoadMore?.()}
              >
                {isFetchingNextPage ? "Loading…" : "Load more products"}{" "}
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListingPage
