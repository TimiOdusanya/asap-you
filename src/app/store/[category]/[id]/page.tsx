'use client'

import React from 'react'
import ProductDetailPage from '@/components/store/shared/ProductDetailPage'
import { getProductDetail, getSimilarProducts, getBreadcrumbs } from '@/lib/storeData'

interface ProductDetailPageProps {
  params: Promise<{
    category: string
    id: string
  }>
}

const ProductDetail = ({ params }: ProductDetailPageProps) => {
  const resolvedParams = React.use(params)
  const productId = resolvedParams.id
  const category = resolvedParams.category

  try {
    const product = getProductDetail(productId, category)
    const similarProducts = getSimilarProducts(category, productId)
    const breadcrumbs = getBreadcrumbs(category, product.name)

    return (
      <ProductDetailPage
        product={product}
        similarProducts={similarProducts}
        breadcrumbs={breadcrumbs}
        category={category}
      />
    )
  } catch (error) {
    console.error('Error loading product details:', error)
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-content-neutral-primary mb-4">Product Not Found</h1>
          <p className="text-content-neutral-tertiary">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
}

export default ProductDetail
