'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight, Star, Clock, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('Bakery')
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const categories = [
    'Bakery',
    'Fresh Produce',
    'Frozen',
    'Baby Items',
    'Personal Care',
    'Organic',
    'Drinks'
  ]

  const products = [
    {
      id: 1,
      name: 'Red Bell Pepper',
      market: 'Grand Square Market',
      rating: 4.5,
      price: 'N 1,200/kg',
      deliveryTime: '20 mins',
      image: '/images/landing/pepper.png',
      lowStock: true,
      emoji: '🍅'
    },
    {
      id: 2,
      name: 'Fresh Bananas',
      market: 'Fresh Mart',
      rating: 4.2,
      price: 'N 800/bunch',
      deliveryTime: '15 mins',
      image: '/images/landing/arrival-1.png',  
      lowStock: false,
      emoji: '🍌'
    },
    {
      id: 3,
      name: 'Organic Spinach',
      market: 'Green Grocer',
      rating: 4.7,
      price: 'N 1,500/pack',
      deliveryTime: '25 mins',
      image: '/images/landing/arrival-2.png',
      lowStock: true,
      emoji: '🥬'
    },
    {
      id: 4,
      name: 'Fresh Carrots',
      market: 'Veggie World',
      rating: 4.3,
      price: 'N 900/kg',
      deliveryTime: '18 mins',
      image: '/images/landing/arrival-3.png',
      lowStock: false,
      emoji: '🥕'
    },
    {
      id: 5,
      name: 'Ripe Avocados',
      market: 'Fruit Paradise',
      rating: 4.6,
      price: 'N 2,000/kg',
      deliveryTime: '22 mins',
      image: '/images/landing/arrival-4.png',
      lowStock: false,
      emoji: '🥑'
    },
    {
      id: 6,
      name: 'Fresh Tomatoes',
      market: 'Farm Fresh',
      rating: 4.4,
      price: 'N 1,100/kg',
      deliveryTime: '16 mins',
      image: '/images/landing/pepper.png',
      lowStock: false,
      emoji: '🍅'
    },
    {
      id: 7,
      name: 'Green Apples',
      market: 'Apple Store',
      rating: 4.8,
      price: 'N 1,800/kg',
      deliveryTime: '30 mins',
      image: '/images/landing/pepper.png',
      lowStock: false,
      emoji: '🍏'
    },
    {
      id: 8,
      name: 'Fresh Lettuce',
      market: 'Salad Bar',
      rating: 4.1,
      price: 'N 1,300/head',
      deliveryTime: '12 mins',
      image: '/images/landing/pepper.png',
      lowStock: true,
      emoji: '🥬'
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const getProductsPerSlide = () => {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
      return 4
    }

    const productsPerSlide = getProductsPerSlide()
    const totalSlides = Math.ceil(products.length / productsPerSlide)
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [products.length])

  const getProductsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
    }
    return 4
  }

  const nextSlide = () => {
    const productsPerSlide = getProductsPerSlide()
    const totalSlides = Math.ceil(products.length / productsPerSlide)
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    const productsPerSlide = getProductsPerSlide()
    const totalSlides = Math.ceil(products.length / productsPerSlide)
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="bg-surface-brand-muted w-full py-20">
      <div className="max-w-[85%] mx-auto h-full flex flex-col justify-center">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-4"> 
          <h2 className="text-content-on-brand text-3xl sm:text-5xl font-normal">Got Taste? <span className="text-content-neutral-secondary">You&apos;ll</span>
          </h2>
          <h2 className="text-content-neutral-secondary text-3xl sm:text-5xl font-normal">
            Love These Picks
          </h2>
          </div>

          <button className="flex items-center text-surface-forest text-lg sm:text-xl font-normal hover:text-surface-forest-deep transition-colors cursor-pointer" 
          onClick={() => router.push('/store')}>
            SEE ALL
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-5 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-surface-forest text-content-on-brand cursor-pointer'
                  : 'bg-surface-canvas text-content-neutral-tertiary hover:border-primary cursor-pointer border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(products.length / 4) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex gap-8">
                  {products.slice(slideIndex * 4, (slideIndex + 1) * 4).map((product) => (
                    <div key={product.id} className="w-1/4 sm:w-1/2 lg:w-1/4 bg-surface-brand-tint rounded-lg relative h-full flex flex-col min-w-[300px] sm:min-w-[250px] lg:min-w-[300px]">
                      {/* Low Stock Badge */}
                      {product.lowStock && (
                        <div className="absolute top-2 right-2 bg-content-warning text-content-neutral-primary text-xs px-2 py-1 rounded-[8px] font-medium z-10">
                          Low Stock
                        </div>
                      )}
                      
                      {/* Product Image */}
                      {/* <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">{product.emoji}</span>
                        </div>
                       
                      </div> */}
                      <div className="w-full h-48 mb-4 flex items-center justify-center">
                        <Image src={product.image} alt={product.name} width={100} height={100} className="w-[260px] h-[160px] object-cover rounded-lg" />
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2 flex-1 flex flex-col pb-6 px-4">
                        <h3 className="text-surface-forest font-medium text-lg">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-content-warning fill-current" />
                            <span className="text-content-neutral-tertiary text-sm">({product.rating})</span>
                          </div>
                          <span className="text-surface-forest font-normal">
                            {product.price}
                          </span>
                        </div>

                        <p className="text-content-neutral-tertiary text-sm">
                          {product.market}
                        </p>

                        <div className="flex items-center gap-1 mb-4">
                          <Clock className="w-4 h-4 text-content-neutral-tertiary" />
                          <span className="text-content-neutral-tertiary text-sm">
                            {product.deliveryTime}
                          </span>
                        </div>

                        <button className="w-full bg-surface-brand-tint border border-surface-forest text-surface-forest py-2 px-4 rounded-xl hover:bg-surface-canvas transition-colors flex items-center justify-center gap-2 mt-auto cursor-pointer">
                          <ShoppingCart className="w-4 h-4" />
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-surface-canvas rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-content-neutral-tertiary rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-surface-canvas rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-content-neutral-tertiary" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(products.length / getProductsPerSlide()) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 cursor-pointer rounded-full transition-colors ${
                currentSlide === index ? 'bg-surface-forest' : 'bg-content-neutral-secondary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products