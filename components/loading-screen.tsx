"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSection } from "@/contexts/section-context"

const airlineFacts = [
  "Some airlines charge up to $65 for a carry-on bag that doesn't fit under the seat.",
  "Budget airlines earn about 40% of their revenue from add-on fees, including baggage charges.",
  "Passengers paid over $5 billion in baggage fees to U.S. airlines in 2022 alone.",
  "Some airlines charge more for baggage at the gate than during online check-in - sometimes double the price.",
  "The weight limit for checked luggage decreased from 70 pounds to 50 pounds over the years, resulting in more fees."
]

export default function LoadingScreen() {
  const { isLoading, setIsLoading } = useSection()
  const [factIndex, setFactIndex] = useState(0)
  
  useEffect(() => {
    // Check if document and window objects are available (browser environment)
    if (typeof window !== 'undefined') {
      // Start fact rotation interval
      const factInterval = setInterval(() => {
        setFactIndex(prev => (prev + 1) % airlineFacts.length)
      }, 3500)

      // Check when page is fully loaded
      const handleLoad = () => {
        // Add a slight delay for smoother transition
        setTimeout(() => setIsLoading(false), 2500)
      }

      // Listen for window load event
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
      }

      // Clean up
      return () => {
        clearInterval(factInterval)
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [setIsLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-r from-purple-900 to-indigo-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path
                d="M50 15 L85 85 L15 85 Z"
                fill="transparent"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          
          <motion.div
            className="mt-8 text-white text-center px-4 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl font-bold mb-2">Loading TravelHoodie Experience</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={factIndex}
                className="text-sm opacity-80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-purple-300 font-medium">Did you know? </span> 
                {airlineFacts[factIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 