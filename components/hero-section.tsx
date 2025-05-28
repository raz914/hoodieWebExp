"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import { useSection } from "@/contexts/section-context"

export default function HeroSection() {
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  const { isLoading } = useSection()
  
  // Facts for the slider
  const facts = [
    {
      intro: "We heard you like to travel",
      heading: "So we invented a travel jacket that saves you up to $100 everytime you fly!"
    }
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Animation trigger state
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (!isLoading) {
      // Add extra delay after loading screen is gone
      const timeout = setTimeout(() => setShow(true), 400)
      return () => clearTimeout(timeout)
    } else {
      setShow(false)
    }
  }, [isLoading])

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center md:justify-start relative  mb-20">
      <div className="absolute inset-0 z-0">
        {/* Empty div where the Canvas used to be */}
      </div>

      <div className="z-10 text-center px-4 md:px-0 max-w-5xl lg:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="hero-intro mb-4"
          style={{
            fontFamily: "'A Pompadour Bold Sample', Arial, sans-serif",
            fontSize: "1.9rem",
            letterSpacing: "0.099em",
            textShadow: "0 2px 8px rgba(0,0,0,0.12)"
          }}
        >
          {facts[currentIndex].intro}
        </motion.div>
        <AnimatePresence mode="wait">
          {show && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              className="w-[80%] mx-auto"
            >
              <motion.h1 className="w-full text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light leading-tight mb-0 ultra-thin-heading mx-auto max-w-6xl lg:max-w-6xl px-4 sm:px-6 md:px-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
              >
                {facts[currentIndex].heading}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
