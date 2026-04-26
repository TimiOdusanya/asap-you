'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Store } from 'lucide-react'
import { FaStoreAlt } from 'react-icons/fa'

export interface Product {
  id: number
  name: string
  store: string
  rating: number
  currentPrice: string
  originalPrice?: string
  discount?: string
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onProductClick: (product: Product) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, onProductClick }) => {
  const isDiscounted = product.discount && product.originalPrice

  if (viewMode === 'list') {
    return (
      <div 
        className="flex items-center space-x-4 p-4 bg-surface-canvas rounded-lg border border-border-subtle hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
          {isDiscounted && (
            <div className="absolute top-1 right-1 bg-content-warning text-content-neutral-primary text-xs px-2 py-1 rounded">
              {product.discount}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-base md:text-lg font-normal text-content-neutral-primary truncate">{product.name}</h3>
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
            {isDiscounted && (
             <span className="text-sm md:text-base text-content-neutral-tertiary line-through">{product.originalPrice}</span>
            )}
             <span className="text-base md:text-lg font-normal text-content-neutral-secondary">{product.currentPrice}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className=" rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      <div className="relative p-2 sm:p-4">
        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 right-2 bg-content-warning text-xs px-2 py-1 rounded z-10 text-content-neutral-primary">
            {product.discount}
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative w-full h-36 sm:h-48 mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-lg font-normal text-content-neutral-secondary truncate">{product.name}</h3>
          <div className="text-xs sm:text-sm text-content-positive flex items-center"> <FaStoreAlt className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="ml-1 truncate">{product.store}</span></div>

          {/* Rating */}
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

          {/* Price */}
          <div className="flex items-center gap-1 sm:space-x-2">
            {isDiscounted && (
              <span className="text-xs sm:text-base text-content-neutral-tertiary line-through">{product.originalPrice}</span>
            )}
            <span className="text-sm sm:text-lg font-normal text-content-neutral-secondary">{product.currentPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
