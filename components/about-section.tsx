"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div ref={ref} className="max-w-[1600px] mx-auto px-4 md:px-6 flex flex-col items-center">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        Our Story
      </motion.h2>

      <motion.div
        className="prose prose-lg max-w-none"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p>
          The TravelHoodie was born out of frustration with the current state of budget air travel. While flights across
          America and Europe have become more affordable, airlines have found new ways to increase revenue through
          excessive baggage fees.
        </p>

        <p>
          We noticed a troubling trend: gate agents were incentivized to find reasons to charge passengers for
          "oversized" personal items, even when those items met the airline's stated requirements. This practice was not
          only unfair but also created anxiety for travelers who couldn't predict whether they'd be hit with unexpected
          fees.
        </p>

        <p>
          Our team of designers and frequent travelers came together to create a solution. The result is the
          TravelHoodie - a garment that looks like ordinary clothing but provides extraordinary storage capacity,
          allowing you to carry essential items on your person rather than in a bag subject to fees.
        </p>

        <p>
          We believe in fair travel practices and empowering consumers to avoid predatory fees. Our mission is to help
          you travel more comfortably, economically, and with peace of mind.
        </p>
      </motion.div>
    </div>
  )
}
