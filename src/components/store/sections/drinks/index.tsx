'use client'

import React from 'react'
import ProductListingPage from '../../shared/ProductListingPage'
import { getProductsByCategory, getBreadcrumbs } from '@/lib/storeData'

const Drinks = () => {
  const products = getProductsByCategory('beverages')
  const breadcrumbs = getBreadcrumbs('Drinks')

  return (
    <ProductListingPage
      category="Drinks"
      products={products}
      breadcrumbs={breadcrumbs}
    />
  )
}

export default Drinks