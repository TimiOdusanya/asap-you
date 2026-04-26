'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  faqs?: FaqItem[]
  heading?: React.ReactNode
}

const defaultFaqs: FaqItem[] = [
  {
    question: "How fast is delivery?",
    answer: "Most orders arrive within 45 minutes to 1 hour, depending on your location and the supermarket's prep time. You'll see real-time updates once your rider is on the way."
  },
  {
    question: "What happens if I'm not home?",
    answer: "Your rider will try to call you. If unreachable, we can reschedule delivery or drop off at a secure location if you've added delivery instructions."
  },
  {
    question: "Can I cancel or change my order?",
    answer: "Yes – you can cancel within 5 minutes of placing the order. For edits, go to My Orders and select Modify Order (if the vendor hasn't started packing yet)."
  },
  {
    question: "Do you mark up prices?",
    answer: "Nope! We partner directly with stores and keep prices as listed in-store. No hidden fees — just a small delivery charge that's clearly shown at checkout."
  }
]

const FaqSection = ({ faqs = defaultFaqs, heading }: FaqSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {heading ?? (
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-normal mb-8 sm:mb-12">
            <span className="text-content-neutral-soft">Still</span>{' '}
            <span className="text-content-neutral-secondary">Curious?</span>
          </h2>
        )}

        <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-surface-elevated rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-3 hover:bg-surface-muted transition-colors duration-200 cursor-pointer"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="text-content-neutral-primary font-medium text-sm sm:text-base lg:text-xl flex-1">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-content-neutral-tertiary transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                  <p className="text-content-neutral-secondary text-sm sm:text-base leading-relaxed">
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
