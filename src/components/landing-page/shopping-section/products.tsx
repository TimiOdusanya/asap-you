'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight, Star, Clock, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('Bakery')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [productsPerSlide, setProductsPerSlide] = useState(4)
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
    }
  ]

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setProductsPerSlide(1)
      else if (window.innerWidth < 1024) setProductsPerSlide(2)
      else setProductsPerSlide(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const totalSlides = Math.ceil(products.length / productsPerSlide)

  useEffect(() => {
    setCurrentSlide((prev) => (prev >= totalSlides ? 0 : prev))
  }, [totalSlides])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [totalSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const cardBasis =
    productsPerSlide === 1
      ? 'basis-full'
      : productsPerSlide === 2
        ? 'basis-1/2'
        : 'basis-1/4'

  return (
    <div className="bg-surface-brand-muted w-full py-16 sm:py-20">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto h-full flex flex-col justify-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex flex-col gap-2 sm:gap-4">
            <h2 className="text-content-on-brand text-2xl sm:text-4xl lg:text-5xl font-normal leading-[110%]">
              Got Taste?{' '}
              <span className="text-content-neutral-secondary">You&apos;ll</span>
            </h2>
            <h2 className="text-content-neutral-secondary text-2xl sm:text-4xl lg:text-5xl font-normal leading-[110%]">
              Love These Picks
            </h2>
          </div>

          <button
            className="self-start sm:self-auto flex items-center text-surface-forest text-base sm:text-lg lg:text-xl font-normal hover:text-surface-forest-deep transition-colors cursor-pointer"
            onClick={() => router.push('/store')}
          >
            SEE ALL
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        <div className="flex gap-3 sm:gap-5 mb-8 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-surface-forest text-content-on-brand cursor-pointer'
                  : 'bg-surface-canvas text-content-neutral-tertiary hover:border-primary cursor-pointer border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full shrink-0 flex gap-4 sm:gap-6 lg:gap-8">
                  {products
                    .slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide)
                    .map((product) => (
                      <div
                        key={product.id}
                        className={`${cardBasis} min-w-0 bg-surface-brand-tint rounded-lg relative flex flex-col`}
                      >
                        {product.lowStock && (
                          <div className="absolute top-2 right-2 bg-content-warning text-content-neutral-primary text-xs px-2 py-1 rounded-[8px] font-medium z-10">
                            Low Stock
                          </div>
                        )}

                        <div className="w-full h-40 sm:h-48 mb-4 flex items-center justify-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={260}
                            height={160}
                            className="w-full h-full max-w-[260px] object-cover rounded-lg"
                          />
                        </div>

                        <div className="space-y-2 flex-1 flex flex-col pb-6 px-4">
                          <h3 className="text-surface-forest font-medium text-base sm:text-lg">
                            {product.name}
                          </h3>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-content-warning fill-current" />
                              <span className="text-content-neutral-tertiary text-xs sm:text-sm">
                                ({product.rating})
                              </span>
                            </div>
                            <span className="text-surface-forest font-normal text-sm sm:text-base text-right">
                              {product.price}
                            </span>
                          </div>

                          <p className="text-content-neutral-tertiary text-xs sm:text-sm">
                            {product.market}
                          </p>

                          <div className="flex items-center gap-1 mb-4">
                            <Clock className="w-4 h-4 text-content-neutral-tertiary" />
                            <span className="text-content-neutral-tertiary text-xs sm:text-sm">
                              {product.deliveryTime}
                            </span>
                          </div>

                          <button className="w-full bg-surface-brand-tint border border-surface-forest text-surface-forest py-2 px-4 rounded-xl hover:bg-surface-canvas transition-colors flex items-center justify-center gap-2 mt-auto cursor-pointer text-sm sm:text-base">
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

          <button
            onClick={prevSlide}
            aria-label="Previous"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-surface-canvas rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-content-neutral-tertiary rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-surface-canvas rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-content-neutral-tertiary" />
          </button>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
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
