'use client'

import React from 'react'
import ProductListingPage from '../../shared/ProductListingPage'
import { getProductsByCategory, getBreadcrumbs } from '@/lib/storeData'

const Pharmacy = () => {
  const products = getProductsByCategory('pharmacy')
  const breadcrumbs = getBreadcrumbs('Pharmacy')

  return (
    <ProductListingPage
      category="Pharmacy"
      products={products}
      breadcrumbs={breadcrumbs}
    />
  )
}

export default Pharmacy