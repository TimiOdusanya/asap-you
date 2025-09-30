'use client'

import React from 'react'
import ProductListingPage from '../../shared/ProductListingPage'
import { getProductsByCategory, getBreadcrumbs } from '@/lib/storeData'

const Supermarkets = () => {
  const products = getProductsByCategory('supermarkets')
  const breadcrumbs = getBreadcrumbs('Supermarket')

  return (
    <ProductListingPage
      category="Supermarket"
      products={products}
      breadcrumbs={breadcrumbs}
    />
  )
}

export default Supermarkets