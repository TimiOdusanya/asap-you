import Categories from '@/components/store/categories/categories'
import BestOffers from '@/components/store/categories/best-offers'
import RecentOrders from '@/components/store/categories/recent-orders'
import React from 'react'

const page = () => {
  return (
    <div>
        <Categories />
        <BestOffers />
        <RecentOrders />
    </div>
  )
}

export default page