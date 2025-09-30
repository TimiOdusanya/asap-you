'use client'

import React from 'react'
import ProductListingPage from '../../shared/ProductListingPage'
import { getProductsByCategory, getBreadcrumbs } from '@/lib/storeData'

const Restaurants = () => {
  const products = getProductsByCategory('restaurant')
  const breadcrumbs = getBreadcrumbs('Restaurant')

  return (
    <ProductListingPage
      category="Restaurant"
      products={products}
      breadcrumbs={breadcrumbs}
    />
  )
}

export default Restaurants