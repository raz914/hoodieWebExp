"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import BackgroundOverlay from "./background-overlay"
import { useOverlay } from "@/contexts/overlay-context"

export default function VideoSection() {
  const ref = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const isMobile = useMobile()
  const { overlayIntensity } = useOverlay()

  // Preload video when component mounts
  useEffect(() => {
    const preloadVideo = () => {
      if (videoRef.current) {
        videoRef.current.load()
      }
    }
    
    preloadVideo()
  }, [])

  return (
    <BackgroundOverlay 
      intensity={overlayIntensity} 
      className="py-8 sm:py-12 md:py-16"
      minHeight="fit-content"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div ref={ref} className={`flex flex-col ${isMobile ? "" : "md:flex-row"} items-center gap-6 sm:gap-8 md:gap-16`}>
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="aspect-video rounded-lg overflow-hidden">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover" 
                autoPlay 
                muted 
                loop 
                playsInline
                src="/video/video.mp4"
                preload="auto"
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">Designed for Modern Travelers</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 text-white text-overflow-fix">
              Our innovative hoodie was created to solve a common problem faced by budget travelers. Airlines in America
              and Europe offer cheap flights but charge excessive fees for carry-on luggage.
            </p>
            {/* <p className="text-lg mb-6">
              Gate agents often receive financial incentives for charging "oversize" personal item fees, sometimes
              unfairly claiming bags are too large even when they're not.
            </p> */}
            <p className="text-base sm:text-lg text-white text-overflow-fix">
              The TravelHoodie gives you the freedom to bring what you need without paying extra fees, letting you travel
              smarter and more economically.
            </p>
          </motion.div>
        </div>
      </div>
    </BackgroundOverlay>
  )
}
