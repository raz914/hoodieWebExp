"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"

export default function HeroSection() {
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Facts for the slider
  const facts = [
    {
      intro: "We heard you like to travel",
      heading: "So we invented a travel jacket that saves you up to $100 everytime you fly!"
    },
    {
      intro: "Did you know?",
      heading: "Some airlines charge up to $65 for a carry-on bag that doesn't fit under the seat"
    },
    {
      intro: "Travel smart",
      heading: "Our jacket has 10+ hidden pockets designed to carry all your essentials"
    },
    {
      intro: "No more baggage fees",
      heading: "Save money on every flight by keeping your valuables with you, not in checked luggage"
    }
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Auto slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % facts.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [facts.length])

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        {/* Empty div where the Canvas used to be */}
      </div>

      <div className="z-10 text-center px-4 md:px-0 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <motion.p className="text-lg md:text-xl mb-4">
              {facts[currentIndex].intro}
            </motion.p>
            <motion.h1 className="text-4xl md:text-6xl font-light leading-tight mb-6">
              {facts[currentIndex].heading}
            </motion.h1>
          </motion.div>
        </AnimatePresence>
        
        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The innovative hoodie that lets you carry more without paying for carry-on luggage
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#product"
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Explore Features
          </a>
        </motion.div>
        
        {/* Slide indicator dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {facts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-black w-4" : "bg-gray-300"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
