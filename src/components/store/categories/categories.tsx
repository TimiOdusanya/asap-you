"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'

const Categories  = () => {
    const [activeCategory, setActiveCategory] = useState('All Stores')

    const categories = [
        {
            id: 1,
            name: "Restaurant",
            image: "/images/store/restaurant.svg",
            url: "/store/bakery"
        },
        {
            id: 2,
            name: "Supermarket",
            image: "/images/store/supermarket.svg",
            url: "/store/supermarkets"
        },
        
        {
            id: 3,
            name: "Gas Filling",
            image: "/images/store/gas-filling.svg",
            url: "/store/frozen"
        },
        {
            id: 4,
            name: "Drinks",
            image: "/images/store/drinks.svg",
            url: "/store/baby-items"
        },
        {
            id: 5,
            name: "Pharmacy",
            image: "/images/store/pharmacy.svg",
            url: "/store/personal-care"
        },
        {
            id: 6,
            name: "Packages",
            image: "/images/store/drink2.svg",
            url: "/categories/organic"
        },
        {
            id: 7,
            name: "More",
            image: "/images/store/pharmacy2.svg",
            url: "/categories/drinks"
        },
        
    ]

  const filters = [
    'All Stores',
    'Supermarkets',
    'Essentials',
    'Local Markets',
    'Fresh & Edibles',
    'Quick Picks',
    'Suppliers'
  ]

  const stores = [
    {
      id: 1,
      name: 'Day by Day Mart',
      rating: 4.5,
      deliveryTime: '20 mins',
      image: '/images/landing/arrival-1.png',
      category: 'Supermarkets'
    },
    {
      id: 2,
      name: 'Fresh Market Plus',
      rating: 4.2,
      deliveryTime: '15 mins',
      image: '/images/landing/arrival-2.png',
      category: 'Supermarkets'
    },
    {
      id: 3,
      name: 'Quick Essentials',
      rating: 4.7,
      deliveryTime: '25 mins',
      image: '/images/landing/arrival-3.png',
      category: 'Essentials'
    },
    {
      id: 4,
      name: 'Local Fresh Store',
      rating: 4.3,
      deliveryTime: '18 mins',
      image: '/images/landing/arrival-4.png',
      category: 'Local Markets'
    },
    {
      id: 5,
      name: 'Green Grocer Hub',
      rating: 4.6,
      deliveryTime: '22 mins',
      image: '/images/landing/arrival-1.png',
      category: 'Fresh & Edibles'
    },
    {
      id: 6,
      name: 'Express Mart',
      rating: 4.4,
      deliveryTime: '16 mins',
      image: '/images/landing/arrival-2.png',
      category: 'Quick Picks'
    },
    {
      id: 7,
      name: 'Supply Chain Store',
      rating: 4.8,
      deliveryTime: '30 mins',
      image: '/images/landing/arrival-3.png',
      category: 'Suppliers'
    },
    {
      id: 8,
      name: 'Daily Essentials',
      rating: 4.1,
      deliveryTime: '12 mins',
      image: '/images/landing/arrival-4.png',
      category: 'Essentials'
    },
    {
      id: 9,
      name: 'Mega Supermarket',
      rating: 4.9,
      deliveryTime: '35 mins',
      image: '/images/landing/arrival-1.png',
      category: 'Supermarkets'
    },
    {
      id: 10,
      name: 'Fresh & Fast',
      rating: 4.3,
      deliveryTime: '14 mins',
      image: '/images/landing/arrival-2.png',
      category: 'Quick Picks'
    },
    {
      id: 11,
      name: 'Local Corner Store',
      rating: 4.0,
      deliveryTime: '10 mins',
      image: '/images/landing/arrival-3.png',
      category: 'Local Markets'
    },
    {
      id: 12,
      name: 'Organic Fresh',
      rating: 4.7,
      deliveryTime: '28 mins',
      image: '/images/landing/arrival-4.png',
      category: 'Fresh & Edibles'
    }
  ]

  // Filter stores based on active category
  const filteredStores = activeCategory === 'All Stores' 
    ? stores 
    : stores.filter(store => store.category === activeCategory)

  return (
    <div className="max-w-[90%] mx-auto py-8 sm:py-10 space-y-12 sm:space-y-16 lg:space-y-20">
        <div className="flex flex-col space-y-4 sm:space-y-6">
            <h1 className='text-content-neutral-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium'>Shop by Categories</h1>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4">
                {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={category.url}
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={100}
                        height={100}
                        className="w-full h-auto max-w-[100px]"
                      />
                      <span className="text-xs sm:text-sm text-content-neutral-primary text-center sm:hidden">
                        {category.name}
                      </span>
                    </Link>
                ))}
            </div>
        </div>


        <div className='space-y-4 sm:space-y-6'>
        <h1 className='text-content-neutral-primary text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium'>Top Picks Near You</h1>
            <div className="flex gap-3 sm:gap-5 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1">
            {filters.map((category) => (
                <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-[16px] whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-subtle text-content-neutral-muted border border-transparent hover:border-primary'
                }`}
                >
                {category}
                </button>
            ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {filteredStores.map((store) => (
                    <div key={store.id} className="rounded-lg overflow-hidden">
                        <div className="w-full aspect-[4/3] sm:h-48 sm:aspect-auto relative rounded-2xl overflow-hidden">
                            <Image
                                src={store.image}
                                alt={store.name}
                                fill
                                className="object-cover rounded-2xl"
                            />
                        </div>

                        <div className="py-3 sm:py-4 space-y-1.5 sm:space-y-2">
                            <h3 className="text-sm sm:text-base md:text-lg font-normal text-content-neutral-primary truncate">
                                {store.name}
                            </h3>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-content-warning">★</span>
                                    <span className="text-xs sm:text-sm text-content-neutral-tertiary">({store.rating})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} className="text-content-neutral-tertiary" aria-hidden />
                                    <span className="text-xs sm:text-sm text-content-neutral-tertiary font-light">{store.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    </div>
  )
}

export default Categories