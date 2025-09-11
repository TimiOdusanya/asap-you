import React from 'react'
import Navbar from './navbar'
import Home from './home'
import Arrivals from './arrivals'
import Shoppers from './shopping-section/shoppers'
import Products from './shopping-section/products'
import FaqSection from './shopping-section/faq-section'
import Footer from './footer'

const Hero = () => {
  return (
    <div className='bg-white'>
       <Navbar />
       <Home />
       <Arrivals />
       <Shoppers />
       <Products />
       <FaqSection />
       <Footer />
    </div>
  )
}

export default Hero