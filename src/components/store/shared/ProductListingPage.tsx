'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {  List, Filter, LayoutGrid, X, ArrowDown } from 'lucide-react'
import FilterSidebar from './FilterSidebar'
import ProductCard from './ProductCard'
import { Product } from './ProductCard'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProductListingPageProps {
  category: string
  products: Product[]
  breadcrumbs: string[]
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({ 
  category, 
  products, 
  breadcrumbs 
}) => {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const [filteredProducts, setFilteredProducts] = useState(products)

  const handleProductClick = (product: Product) => {
    router.push(`/store/${category.toLowerCase()}/${product.id}`)
  }

  const handleFilterChange = (_filters: Record<string, unknown>) => {
    // Apply filters logic here
    // For now, just show all products
    setFilteredProducts(products)
  }

  const handleClearAll = () => {
    setFilteredProducts(products)
  }

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
    { value: 'newest', label: 'Newest' }
  ]

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-[95%] md:max-w-[90%] mx-auto">

        <div className="flex">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              category={category}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
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
                <FilterSidebar
                  category={category}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            )}

            {/* Active Filters */}
            <div className="flex flex-col gap-2 mb-4">
              {/* Row 1: label + clear all */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-content-neutral-secondary">Active Filter</span>
                <Button
                  variant="link"
                  className="text-xs sm:text-sm text-content-negative underline hover:text-content-warning p-0 h-auto"
                >
                  Clear all
                </Button>
              </div>
              {/* Row 2: chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary text-primary-foreground cursor-pointer">
                  Dailys <X className="ml-1" size={14}/>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary text-primary-foreground cursor-pointer">
                  Dairy & Eggs <X className="ml-1" size={14}/>
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary text-primary-foreground cursor-pointer">
                  New Arrivals <X className="ml-1" size={14}/>
                </span>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-8 ">
              <Button className="flex items-center gap-2 px-4">
                Load More Products <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListingPage
