'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'

const Arrivals = () => {
  const [slidesToShow, setSlidesToShow] = useState(1)
  const [paused, setPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const controls = useAnimation()

  const images = [
    { src: "/images/landing/arrival-1.png", alt: "arrivals" },
    { src: "/images/landing/arrival-2.png", alt: "arrivals" },
    { src: "/images/landing/arrival-3.png", alt: "arrivals" },
    { src: "/images/landing/arrival-4.png", alt: "arrivals" },
  ]

  const cardWidth = 340
  const gap = 24
  const slideWidth = cardWidth + gap

  // duplicate to allow seamless loop
  const looped = [...images, ...images]

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1200) setSlidesToShow(3)
      else if (window.innerWidth >= 768) setSlidesToShow(2)
      else setSlidesToShow(1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // autoplay treadmill
  useEffect(() => {
    if (!paused) {
      controls.start({
        x: [-0, -looped.length * slideWidth / 2],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 20
          }
        }
      })
    } else {
      controls.stop()
    }
  }, [paused, looped.length, slideWidth, controls])

  // Update active dot index while moving
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!paused) {
      interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % images.length)
      }, 5000) // change active dot every 5s (sync with belt speed)
    }
    return () => clearInterval(interval)
  }, [paused, images.length])

  // Chevron click (manual shift by one slide group)
  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length)
    controls.start({ x: `+=${slideWidth}`, transition: { duration: 0.6 } })
  }

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % images.length)
    controls.start({ x: `-=${slideWidth}`, transition: { duration: 0.6 } })
  }

  return (
    <div className="bg-green-600 h-[734px] w-full">
      <div className="max-w-[85%] mx-auto h-full flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-10">
          {/* Headings */}
          <div className="flex flex-col justify-center items-center gap-6">
            <h1 className="text-[48px] font-normal leading-[100%] text-gray-200">
              From Aisle to Arrival, Effortlessly.
            </h1>
            <h1 className="text-[48px] font-normal leading-[100%] text-green-50">
              Here&apos;s How We Get Your Groceries to You Fast
            </h1>
          </div>

          {/* Carousel */}
          <div
            className="relative flex justify-center items-center"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden w-full max-w-7xl">
              <motion.div
                className="flex gap-[24px]"
                animate={controls}
                style={{ width: 'max-content' }}
              >
                {looped.map((image, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-[340px] h-[374px] flex justify-center"
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
                      className="rounded-lg shadow-lg object-cover w-[340px] h-[374px]"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors cursor-pointer ${
                  activeIndex === i ? "bg-green-500" : "bg-white/30"
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
