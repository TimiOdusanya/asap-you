'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How fast is delivery?",
      answer: "Most orders arrive within 45 minutes to 1 hour, depending on your location and the supermarket’s prep time. You’ll see real-time updates once your rider is on the way."
    },
    {
      question: "What happens if I'm not home?",
      answer: "Your rider will try to call you. If unreachable, we can reschedule delivery or drop off at a secure location if you’ve added delivery instructions."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "Yes – you can cancel within 5 minutes of placing the order. For edits, go to My Orders and select “Modify Order” (if the vendor hasn’t started packing yet)."
    },
    {
      question: "Do you mark up prices?",
      answer: "Nope! We partner directly with stores and keep prices as listed in-store. No hidden fees—just a small delivery charge that’s clearly shown at checkout."
    }
  ]

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-normal mb-12">
          <span className="text-gray-100">Still</span>{' '}
          <span className="text-gray-300">Curious?</span>
        </h2>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-gray-400 font-medium text-xl">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FaqSection