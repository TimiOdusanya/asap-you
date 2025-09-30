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
        className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
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
            <div className="absolute top-1 right-1 bg-yellow-400 text-xs px-2 py-1 rounded">
              {product.discount}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-lg font-normal text-gray-900 truncate">{product.name}</h3>
          <div className="text-sm text-green-400 flex items-center"> <FaStoreAlt className="w-4 h-4" /> <span className="ml-1">{product.store}</span></div>
          <div className="flex items-center mt-1">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 space-x-2 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2">
            {isDiscounted && (
             <span className="text-base text-[#555555] line-through">{product.originalPrice}</span>
            )}
             <span className="text-lg font-normal text-[#3C3C3C]">{product.currentPrice}</span>
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
      <div className="relative p-4">
        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded z-10 text-white">
            {product.discount}
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative w-full h-48 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-normal text-gray-300 truncate">{product.name}</h3>
          <div className="text-sm text-green-400 flex items-center"> <FaStoreAlt className="w-4 h-4" /> <span className="ml-1">{product.store}</span></div>
          
          {/* Rating */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 space-x-2 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-[#555555]">({product.rating})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            {isDiscounted && (
              <span className="text-base text-[#555555] line-through">{product.originalPrice}</span>
            )}
            <span className="text-lg font-normal text-[#3C3C3C]">{product.currentPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
