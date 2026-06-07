'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const images = [
  { src: "/images/landing/arrival-1.png", alt: "Browse stores on Asapu" },
  { src: "/images/landing/arrival-2.png", alt: "Build your grocery cart" },
  { src: "/images/landing/arrival-3.png", alt: "Secure checkout" },
  { src: "/images/landing/arrival-4.png", alt: "Track delivery to your door" },
]

const GAP = 24

const extendedImages = [...images, ...images]

const Arrivals = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [cardWidth, setCardWidth] = useState(260)

  const slideWidth = cardWidth + GAP
  const dotIndex = ((activeIndex % images.length) + images.length) % images.length

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCardWidth(340)
      else if (window.innerWidth >= 640) setCardWidth(300)
      else setCardWidth(240)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setTransitionEnabled(true)
      setActiveIndex((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused])

  const goTo = useCallback((index: number) => {
    setPaused(true)
    setTransitionEnabled(true)
    setActiveIndex(index)
  }, [])

  const handlePrev = () => {
    setPaused(true)
    if (activeIndex === 0) {
      setTransitionEnabled(false)
      setActiveIndex(images.length)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
          setActiveIndex(images.length - 1)
        })
      })
      return
    }
    setTransitionEnabled(true)
    setActiveIndex((prev) => prev - 1)
  }

  const handleNext = () => {
    setPaused(true)
    setTransitionEnabled(true)
    setActiveIndex((prev) => prev + 1)
  }

  const handleAnimationComplete = () => {
    if (activeIndex >= images.length) {
      setTransitionEnabled(false)
      setActiveIndex(0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
        })
      })
    }
  }

  useEffect(() => {
    if (!paused) return
    const resume = window.setTimeout(() => setPaused(false), 8000)
    return () => window.clearTimeout(resume)
  }, [paused, activeIndex])

  return (
    <div className="bg-surface-forest w-full py-16 sm:py-20 lg:py-24">
      <div className="max-w-[90%] lg:max-w-[85%] mx-auto flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-8 sm:gap-10">
          <div className="flex flex-col justify-center items-center gap-3 sm:gap-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-soft">
              From Aisle to Arrival, Effortlessly.
            </h1>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-[110%] text-surface-brand-tint">
              Here&apos;s How We Get Your Groceries to You Fast
            </h1>
          </div>

          <div
            className="relative flex justify-center items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden w-full max-w-7xl">
              <motion.div
                className="flex"
                style={{ gap: GAP, width: 'max-content' }}
                animate={{ x: -activeIndex * slideWidth }}
                transition={
                  transitionEnabled
                    ? { type: 'spring', stiffness: 260, damping: 32 }
                    : { duration: 0 }
                }
                onAnimationComplete={handleAnimationComplete}
              >
                {extendedImages.map((image, index) => (
                  <motion.div
                    key={`${image.src}-${index}`}
                    className="flex-shrink-0 flex justify-center"
                    style={{ width: cardWidth, height: cardWidth * (374 / 340) }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0px 12px 30px rgba(0,0,0,0.25)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={340}
                      height={374}
                      className="rounded-lg shadow-lg object-cover w-full h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-2 sm:mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={dotIndex === i ? "true" : undefined}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors cursor-pointer ${
                  dotIndex === i ? "bg-surface-brand-muted" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arrivals
