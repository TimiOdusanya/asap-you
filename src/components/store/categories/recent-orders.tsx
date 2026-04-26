'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RecentOrders = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const recentOrders = [
    {
      id: 1,
      name: 'Pampers',
      price: 'N 18,000',
      store: 'Dailys Supermarket',
      lastOrdered: '3 days ago',
      image: '/images/landing/arrival-1.png',
      category: 'Baby Care'
    },
    {
      id: 2,
      name: 'Fresh Milk',
      price: 'N 2,500',
      store: 'Fresh Mart',
      lastOrdered: '1 day ago',
      image: '/images/landing/arrival-2.png',
      category: 'Dairy'
    },
    {
      id: 3,
      name: 'Bread Loaf',
      price: 'N 1,200',
      store: 'Bakery Corner',
      lastOrdered: '2 days ago',
      image: '/images/landing/arrival-3.png',
      category: 'Bakery'
    },
    {
      id: 4,
      name: 'Cooking Oil',
      price: 'N 3,500',
      store: 'Kitchen Essentials',
      lastOrdered: '5 days ago',
      image: '/images/landing/arrival-4.png',
      category: 'Pantry'
    },
    {
      id: 5,
      name: 'Rice Bag',
      price: 'N 8,000',
      store: 'Grain Store',
      lastOrdered: '1 week ago',
      image: '/images/landing/arrival-1.png',
      category: 'Grains'
    },
    {
      id: 6,
      name: 'Toilet Paper',
      price: 'N 1,800',
      store: 'Home Essentials',
      lastOrdered: '4 days ago',
      image: '/images/landing/arrival-2.png',
      category: 'Household'
    },
    {
      id: 7,
      name: 'Apples',
      price: 'N 2,200',
      store: 'Fruit Market',
      lastOrdered: '2 days ago',
      image: '/images/landing/arrival-3.png',
      category: 'Fruits'
    },
    {
      id: 8,
      name: 'Chicken Breast',
      price: 'N 4,500',
      store: 'Meat Shop',
      lastOrdered: '3 days ago',
      image: '/images/landing/arrival-4.png',
      category: 'Meat'
    }
  ]

  // Get products per slide based on screen size
  const getProductsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1
      if (window.innerWidth < 1024) return 2
    }
    return 4
  }

  const [productsPerSlide, setProductsPerSlide] = useState(4)

  // Update products per slide on window resize
  useEffect(() => {
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide())
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(recentOrders.length / productsPerSlide))
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [recentOrders.length, productsPerSlide])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(recentOrders.length / productsPerSlide))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(recentOrders.length / productsPerSlide)) % Math.ceil(recentOrders.length / productsPerSlide))
  }

  return (
    <div className='bg-surface-canvas'>
      <div className="max-w-[90%] mx-auto py-12 sm:py-16 lg:py-20">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className='text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold text-content-neutral-primary'>Recent Orders</h1>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-surface-canvas rounded-full border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary hover:text-primary-foreground transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-surface-forest transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(recentOrders.length / productsPerSlide) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full shrink-0 flex gap-4 sm:gap-6 lg:gap-8">
                  {recentOrders.slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide).map((order) => (
                    <div key={order.id} className="flex-1 min-w-0 rounded-2xl p-3 sm:p-4 lg:p-6">
                      <div className="mb-4 flex items-center justify-center bg-surface-muted rounded-xl w-full aspect-[309/342]">
                          <Image
                            src={order.image}
                            alt={order.name}
                            width={200}
                            height={240}
                            className="object-cover rounded-xl w-[60%] h-[70%]"
                          />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-normal text-content-neutral-primary truncate">
                            {order.name}
                          </h3>
                          <span className="text-sm sm:text-base md:text-lg font-normal text-content-neutral-primary shrink-0">
                            {order.price}
                          </span>
                        </div>

                        <p className="text-sm sm:text-base text-content-neutral-primary font-normal truncate">
                          {order.store}
                        </p>

                        <p className="text-sm sm:text-base text-content-neutral-tertiary font-normal">
                          Last ordered: {order.lastOrdered}
                        </p>

                        <div className="flex items-center justify-between gap-2 pt-2">
                          <Button variant="outline" className="px-4 sm:px-5 py-2 border border-content-neutral-secondary text-content-neutral-primary rounded-full text-sm sm:text-base font-medium hover:bg-surface-muted transition-colors cursor-pointer">
                            Reorder
                          </Button>
                          <button className="text-content-positive underline text-sm sm:text-base font-light hover:text-surface-forest transition-colors cursor-pointer">
                            View Store
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(recentOrders.length / productsPerSlide) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 cursor-pointer rounded-full transition-colors ${
                currentSlide === index ? 'bg-surface-brand-muted' : 'bg-content-neutral-secondary'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentOrders