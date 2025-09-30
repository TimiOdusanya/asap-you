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
    <div className="min-h-screen">
      <div className="max-w-[90%] mx-auto">
       

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
          <div className="flex-1 p-6">
             {/* Breadcrumbs */}
            <div className="bg-white py-4 mb-6">
              <nav className="text-sm text-gray-600">
                {breadcrumbs.map((crumb, index) => (
                  <span key={index}>
                    {index > 0 && <span className="mx-2">/</span>}
                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            </div>
            {/* Header Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>

                {/* Sort Dropdown */}
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-normal text-gray-300">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[130px] rounded-full shadow-none cursor-pointer">
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
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-300">View:</span>
                <div className="flex rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <span className="text-base font-medium text-gray-300">Active Filter</span>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-400 text-white cursor-pointer">
                    Dailys <X className="ml-1" size={16}/>
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-400 text-white cursor-pointer">
                    Dairy & Eggs <X className="ml-1" size={16}/>
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-400 text-white cursor-pointer">
                    New Arrivals <X className="ml-1" size={16}/>
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                className="text-sm text-red-300 underline hover:text-red-400 p-0 h-auto"
              >
                Clear all
              </Button>
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
