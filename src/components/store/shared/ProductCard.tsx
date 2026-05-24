'use client'

import React from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { FaStoreAlt } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  store: string
  rating: number
  currentPrice: string
  originalPrice?: string
  discount?: string
  image: string
  category: string
  outOfStock?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onProductClick: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onProductClick }) => {
  const showStrikePrice = Boolean(product.originalPrice)
  const showDiscountBadge = Boolean(product.discount && showStrikePrice && !product.outOfStock)
  const outOfStock = Boolean(product.outOfStock)

  if (viewMode === 'list') {
    return (
      <div 
        className={cn(
          "flex items-center space-x-4 p-4 bg-surface-canvas rounded-lg border border-border-subtle hover:shadow-md transition-shadow cursor-pointer",
          outOfStock && "opacity-80"
        )}
        onClick={() => onProductClick(product)}
      >
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={
              product.image.startsWith("http://") ||
              product.image.startsWith("https://")
            }
            className={cn("object-cover rounded-lg", outOfStock && "grayscale")}
          />
          {outOfStock ? (
            <div className="absolute inset-x-0 bottom-0 rounded-b-lg bg-content-negative/90 py-0.5 text-center text-[9px] font-semibold uppercase text-white">
              Out of stock
            </div>
          ) : showDiscountBadge ? (
            <div className="absolute top-1 right-1 bg-content-warning text-content-neutral-primary text-xs px-2 py-1 rounded">
              {product.discount}
            </div>
          ) : null}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-base md:text-lg font-normal text-content-neutral-primary truncate">{product.name}</h3>
          {outOfStock ? (
            <p className="text-xs font-medium text-content-negative">Currently unavailable</p>
          ) : null}
          <div className="text-sm text-content-positive flex items-center"> <FaStoreAlt className="w-4 h-4" /> <span className="ml-1">{product.store}</span></div>
          <div className="flex items-center mt-1">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 space-x-2 ${
                    i < Math.floor(product.rating) ? 'text-content-warning fill-current' : 'text-content-neutral-muted'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-content-neutral-tertiary">({product.rating})</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2">
            {showStrikePrice ? (
             <span className="text-sm md:text-base text-content-neutral-tertiary line-through">{product.originalPrice}</span>
            ) : null}
             <span className="text-base md:text-lg font-normal text-content-neutral-secondary">{product.currentPrice}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn("rounded-lg hover:shadow-md transition-shadow cursor-pointer", outOfStock && "opacity-80")}
      onClick={() => onProductClick(product)}
    >
      <div className="relative p-2 sm:p-4">
        {outOfStock ? (
          <div className="absolute left-2 top-2 z-10 rounded bg-content-negative px-2 py-1 text-[10px] font-semibold uppercase text-white">
            Out of stock
          </div>
        ) : showDiscountBadge ? (
          <div className="absolute top-2 right-2 bg-content-warning text-xs px-2 py-1 rounded z-10 text-content-neutral-primary">
            {product.discount}
          </div>
        ) : null}
        
        <div className="relative w-full h-36 sm:h-48 mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={
              product.image.startsWith("http://") ||
              product.image.startsWith("https://")
            }
            className={cn("object-cover rounded-lg", outOfStock && "grayscale")}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm sm:text-lg font-normal text-content-neutral-secondary truncate">{product.name}</h3>
          {outOfStock ? (
            <p className="text-xs font-medium text-content-negative">Currently unavailable</p>
          ) : null}
          <div className="text-xs sm:text-sm text-content-positive flex items-center"> <FaStoreAlt className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="ml-1 truncate">{product.store}</span></div>

          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                    i < Math.floor(product.rating) ? 'text-content-warning fill-current' : 'text-content-neutral-muted'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-xs sm:text-sm text-content-neutral-tertiary">({product.rating})</span>
          </div>

          <div className="flex items-center gap-1 sm:space-x-2">
            {showStrikePrice ? (
              <span className="text-xs sm:text-base text-content-neutral-tertiary line-through">{product.originalPrice}</span>
            ) : null}
            <span className="text-sm sm:text-lg font-normal text-content-neutral-secondary">{product.currentPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
