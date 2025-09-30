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
    <div className='bg-white'>
      <div className="max-w-[90%] mx-auto py-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className='text-xl sm:text-[28px] font-semibold text-gray-400'>Recent Orders</h1>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full border border-green-400 flex items-center justify-center hover:bg-green-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-green-400 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
                <div key={slideIndex} className="w-full flex gap-4 sm:gap-8">
                  {recentOrders.slice(slideIndex * productsPerSlide, (slideIndex + 1) * productsPerSlide).map((order) => (
                    <div key={order.id} className="flex-1 rounded-2xl p-4 sm:p-6 min-w-[250px] sm:min-w-[280px]">
                      {/* Product Image */}
                      <div className="mb-4 flex items-center justify-center bg-gray-50 rounded-xl w-[309px] h-[342px]">
                          <Image 
                            src={order.image} 
                            alt={order.name} 
                            width={120} 
                            height={120} 
                            className="object-cover rounded-xl w-50 h-60"
                          />
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-normal text-gray-800">
                            {order.name}
                          </h3>
                          <span className="text-lg font-normal text-gray-800">
                            {order.price}
                          </span>
                        </div>

                        <p className="text-base text-[#333333] font-normal">
                          {order.store}
                        </p>

                        <p className="text-base text-gray-600 font-normal">
                          Last ordered: {order.lastOrdered}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <Button variant="outline" className="px-5 py-2 border border-gray-300 text-gray-800 rounded-full text-base font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                            Reorder
                          </Button>
                          <button className="text-green-400 underline text-base font-light hover:text-green-600 transition-colors cursor-pointer">
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
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentOrders