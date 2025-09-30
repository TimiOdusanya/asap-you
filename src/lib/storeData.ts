export interface Product {
  id: number
  name: string
  store: string
  rating: number
  currentPrice: string
  originalPrice?: string
  discount?: string
  image: string
  category: string
}

export interface ProductDetail {
  id: number
  name: string
  description: string
  rating: number
  price: string
  unit: string
  stock: number
  images: string[]
  store: string
  deliveryInfo: {
    freeDelivery: boolean
    postalCodeText: string
  }
  returnInfo: {
    available: boolean
    checkText: string
  }
}

// Dummy data for different categories
export const getProductsByCategory = (category: string): Product[] => {
  const baseProducts: Product[] = [
    // Supermarket Products
    {
      id: 1,
      name: 'Bell Peppers',
      store: 'Dailys Supermarket',
      rating: 4.5,
      currentPrice: 'N 2,500',
      originalPrice: 'N 3,000',
      discount: '20% off',
      image: '/images/landing/arrival-1.png',
      category: 'Fresh Produce'
    },
    {
      id: 2,
      name: 'Fresh Milk',
      store: 'Fresh Mart',
      rating: 4.2,
      currentPrice: 'N 1,200',
      image: '/images/landing/arrival-2.png',
      category: 'Dairy'
    },
    {
      id: 3,
      name: 'Bread Loaf',
      store: 'Bakery Corner',
      rating: 4.7,
      currentPrice: 'N 800',
      image: '/images/landing/arrival-3.png',
      category: 'Bakery'
    },
    {
      id: 4,
      name: 'Cooking Oil',
      store: 'Kitchen Essentials',
      rating: 4.3,
      currentPrice: 'N 3,500',
      originalPrice: 'N 4,200',
      discount: '20% off',
      image: '/images/landing/arrival-4.png',
      category: 'Pantry'
    },
    {
      id: 5,
      name: 'Rice Bag',
      store: 'Grain Store',
      rating: 4.6,
      currentPrice: 'N 8,000',
      image: '/images/landing/arrival-1.png',
      category: 'Grains'
    },
    {
      id: 6,
      name: 'Toilet Paper',
      store: 'Home Essentials',
      rating: 4.1,
      currentPrice: 'N 1,800',
      originalPrice: 'N 2,200',
      discount: '20% off',
      image: '/images/landing/arrival-2.png',
      category: 'Household'
    },
    {
      id: 7,
      name: 'Apples',
      store: 'Fruit Market',
      rating: 4.4,
      currentPrice: 'N 2,200',
      image: '/images/landing/arrival-3.png',
      category: 'Fruits'
    },
    {
      id: 8,
      name: 'Chicken Breast',
      store: 'Meat Shop',
      rating: 4.8,
      currentPrice: 'N 4,500',
      image: '/images/landing/arrival-4.png',
      category: 'Meat'
    },
    {
      id: 9,
      name: 'Pampers',
      store: 'Dailys Supermarket',
      rating: 4.5,
      currentPrice: 'N 18,000',
      originalPrice: 'N 22,500',
      discount: '20% off',
      image: '/images/landing/arrival-1.png',
      category: 'Baby Care'
    },
    {
      id: 10,
      name: 'Energy Drink',
      store: 'Beverage Store',
      rating: 4.0,
      currentPrice: 'N 1,500',
      image: '/images/landing/arrival-2.png',
      category: 'Beverages'
    },
    // Restaurant Products
    {
      id: 11,
      name: 'Pizza Margherita',
      store: 'Mama Mia Restaurant',
      rating: 4.6,
      currentPrice: 'N 3,500',
      image: '/images/landing/arrival-3.png',
      category: 'Restaurant'
    },
    {
      id: 12,
      name: 'Chicken Burger',
      store: 'Burger Palace',
      rating: 4.4,
      currentPrice: 'N 2,800',
      image: '/images/landing/arrival-4.png',
      category: 'Restaurant'
    },
    {
      id: 13,
      name: 'Jollof Rice',
      store: 'Nigerian Kitchen',
      rating: 4.8,
      currentPrice: 'N 2,200',
      image: '/images/landing/arrival-1.png',
      category: 'Restaurant'
    },
    {
      id: 14,
      name: 'Fried Chicken',
      store: 'KFC Nigeria',
      rating: 4.3,
      currentPrice: 'N 4,500',
      image: '/images/landing/arrival-2.png',
      category: 'Restaurant'
    },
    // Drinks Products
    {
      id: 15,
      name: 'Coca Cola',
      store: 'Beverage Store',
      rating: 4.2,
      currentPrice: 'N 800',
      image: '/images/landing/arrival-3.png',
      category: 'Beverages'
    },
    {
      id: 16,
      name: 'Orange Juice',
      store: 'Fresh Drinks',
      rating: 4.5,
      currentPrice: 'N 1,200',
      image: '/images/landing/arrival-4.png',
      category: 'Beverages'
    },
    {
      id: 17,
      name: 'Water Bottle',
      store: 'Aqua Store',
      rating: 4.0,
      currentPrice: 'N 500',
      image: '/images/landing/arrival-1.png',
      category: 'Beverages'
    },
    // Pharmacy Products
    {
      id: 18,
      name: 'Pain Relief Tablets',
      store: 'Health Plus Pharmacy',
      rating: 4.3,
      currentPrice: 'N 2,800',
      image: '/images/landing/arrival-2.png',
      category: 'Pharmacy'
    },
    {
      id: 19,
      name: 'Vitamin C',
      store: 'MediCare Pharmacy',
      rating: 4.6,
      currentPrice: 'N 3,500',
      image: '/images/landing/arrival-3.png',
      category: 'Pharmacy'
    },
    {
      id: 20,
      name: 'Cough Syrup',
      store: 'Wellness Pharmacy',
      rating: 4.1,
      currentPrice: 'N 1,800',
      image: '/images/landing/arrival-4.png',
      category: 'Pharmacy'
    }
  ]

  // Filter products based on category
  if (category.toLowerCase() === 'supermarkets') {
    return baseProducts.filter(product => 
      ['Fresh Produce', 'Dairy', 'Bakery', 'Pantry', 'Grains', 'Household', 'Fruits', 'Meat', 'Baby Care', 'Beverages'].includes(product.category)
    )
  }
  
  return baseProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  )
}

export const getProductDetail = (id: number, category?: string): ProductDetail => {
  // If category is provided, search in that category first
  let product = null
  if (category) {
    product = getProductsByCategory(category).find(p => p.id === id)
  }
  
  // If not found in specific category, search in all products
  if (!product) {
    const allProducts = [
      ...getProductsByCategory('supermarkets'),
      ...getProductsByCategory('restaurant'),
      ...getProductsByCategory('beverages'),
      ...getProductsByCategory('pharmacy')
    ]
    product = allProducts.find((p: Product) => p.id === id)
  }
  
  if (!product) {
    throw new Error('Product not found')
  }

  return {
    id: product.id,
    name: product.name,
    description: 'Fresh, crunchy, and naturally sweet bell peppers perfect for salads, cooking, and grilling',
    rating: product.rating,
    price: product.currentPrice,
    unit: 'per kg',
    stock: 25,
    images: [
      product.image,
      '/images/landing/arrival-2.png',
      '/images/landing/arrival-3.png'
    ],
    store: product.store,
    deliveryInfo: {
      freeDelivery: true,
      postalCodeText: 'Enter your postal code for delivery availability'
    },
    returnInfo: {
      available: true,
      checkText: 'Check to see if option is available'
    }
  }
}

export const getSimilarProducts = (category: string, currentProductId: number): Product[] => {
  let allProducts = getProductsByCategory(category)
  
  
  // If no products found in the specific category, get some from all products
  if (allProducts.length <= 1) {
    // Get all products from all categories
    allProducts = [
      ...getProductsByCategory('supermarkets'),
      ...getProductsByCategory('restaurant'),
      ...getProductsByCategory('beverages'),
      ...getProductsByCategory('pharmacy')
    ]
  }
  
  // Filter out the current product and get up to 4 similar products
  const similarProducts = allProducts.filter(product => product.id !== currentProductId).slice(0, 4)
  
 
  // If we still don't have enough products, fill with any remaining products
  if (similarProducts.length < 4) {
    const allAvailableProducts = [
      ...getProductsByCategory('supermarkets'),
      ...getProductsByCategory('restaurant'),
      ...getProductsByCategory('beverages'),
      ...getProductsByCategory('pharmacy')
    ]
    
    const remainingProducts = allAvailableProducts.filter(product => 
      product.id !== currentProductId && 
      !similarProducts.some(sp => sp.id === product.id)
    ).slice(0, 4 - similarProducts.length)
    
    similarProducts.push(...remainingProducts)
  }
  
  return similarProducts
}

export const getBreadcrumbs = (category: string, productName?: string): string[] => {
  const baseBreadcrumbs = ['Main Page', 'Category', category]
  if (productName) {
    baseBreadcrumbs.push(productName)
  }
  return baseBreadcrumbs
}
