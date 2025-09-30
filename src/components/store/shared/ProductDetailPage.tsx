'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Minus, Plus, ChevronLeft } from 'lucide-react'
import ProductCard from './ProductCard'
import { Product } from './ProductCard'
import { Button } from '@/components/ui/button'

interface ProductDetail {
  id: number
  name: string
  description: string
  rating: number
  price: string
  unit: string
  stock: number
  images: string[]
  store: string
  deliveryInfo: {
    freeDelivery: boolean
    postalCodeText: string
  }
  returnInfo: {
    available: boolean
    checkText: string
  }
}

interface ProductDetailPageProps {
  product: ProductDetail
  similarProducts: Product[]
  breadcrumbs: string[]
  category: string
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product, 
  similarProducts, 
  breadcrumbs,
  category 
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleSimilarProductClick = (similarProduct: Product) => {
    // Navigate to the similar product detail page
    window.location.href = `/store/${category.toLowerCase()}/${similarProduct.id}`
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="bg-white px-6 py-4">
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

        <div className="p-6">
          {/* Back Button */}
          <Link 
            href={`/store/${category.toLowerCase()}`}
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ChevronLeft size={20} className="mr-2 text-green-600" />
            Back to {category}
          </Link>

          {/* Main Product Section */}
          <div className="rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-10">
                {/* Main Image */}
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex space-x-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`cursor-pointer relative w-30 h-30 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-400 mb-2">{product.name}</h1>
                  <p className="text-gray-600 text-lg text-light">{product.description}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rating})</span>
                </div>

                <div className="text-sm text-gray-500 border-b border-gray-200 pb-4"></div>

                {/* Price */}
                <div className="text-2xl font-semibold text-gray-400">
                  {product.price} / {product.unit}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  {/* <span className="text-gray-700 font-medium">Quantity:</span> */}
                  <div className="flex items-center border-[1px] border-gray-600 rounded-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="rounded-r-none"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[40px] text-center text-gray-400">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="rounded-l-none"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="text-base text-gray-500 font-light">
                  Only <span className="text-red-300">{product.stock} packs</span> left - Don&apos;t miss out
                </div>

                <div className="text-sm text-gray-500 border-b border-gray-200 pb-4"></div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button className=" w-[188px]">
                    Buy Now
                  </Button>
                  <Button variant="outline" className="w-[188px] border-[1px] border-gray-400">
                    Add to Cart
                  </Button>
                </div>

                {/* Delivery Information */}
                <div className="space-y-3 pt-6">
                  <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-2">
                    <span className="font-medium text-gray-400">Free Delivery</span>
                    <p className="text-sm text-coral-50 cursor-pointer underline hover:underline">
                      {product.deliveryInfo.postalCodeText}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-2">
                    <span className="font-medium text-gray-400">Return Delivery</span>
                    <p className="text-sm text-coral-50 cursor-pointer underline hover:underline">
                      {product.returnInfo.checkText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Items Section */}
          <div className="bg-white rounded-lg p-10">
            <h2 className="text-2xl font-medium text-gray-400 mb-6">Similar Items you might like</h2>
            {similarProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <ProductCard
                    key={similarProduct.id}
                    product={similarProduct}
                    viewMode="grid"
                    onProductClick={handleSimilarProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No similar products found</p>
                <p className="text-sm text-gray-400 mt-2">Debug: similarProducts.length = {similarProducts.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
