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
  const productId = parseInt(resolvedParams.id)
  const category = resolvedParams.category

  try {
    const product = getProductDetail(productId, category)
    const similarProducts = getSimilarProducts(category, productId)
    const breadcrumbs = getBreadcrumbs(category, product.name)
    
    // Debug logging
    console.log('Product Detail Debug:', {
      productId,
      category,
      product: product.name,
      similarProductsCount: similarProducts.length,
      similarProducts: similarProducts.map(p => ({ id: p.id, name: p.name, category: p.category }))
    })

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }
}

export default ProductDetail
