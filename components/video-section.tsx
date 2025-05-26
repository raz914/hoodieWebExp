"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import BackgroundOverlay from "./background-overlay"
import { useOverlay } from "@/contexts/overlay-context"

export default function VideoSection() {
  const ref = useRef(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const isMobile = useMobile()
  const { overlayIntensity } = useOverlay()
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Preload video when component mounts
  useEffect(() => {
    const preloadVideo = () => {
      if (videoRef.current) {
        videoRef.current.load()
      }
    }
    
    preloadVideo()
  }, [])

  // Update current time and duration
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

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
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -100, scale: 0.8 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          >
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
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
            {/* Controls */}
            <div className="flex items-center gap-4 mt-4 px-2 w-full">
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center rounded-md bg-[#232b32] text-white hover:bg-[#232b32]/90 transition-colors focus:outline-none"
                aria-label={isPlaying ? "Pause" : "Play"}
                style={{ fontSize: 0 }}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28">
                    <rect x="5" y="4" width="5" height="16" rx="1.5" />
                    <rect x="14" y="4" width="5" height="16" rx="1.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </button>
              <span className="text-base text-black font-mono min-w-[48px] text-right select-none">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-2 mx-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                aria-label="Seek"
                style={{
                  accentColor: '#111',
                  height: '8px',
                }}
              />
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #111;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 0 2px #0003;
                  margin-top: -8px;
                }
                input[type='range']::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #111;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 0 2px #0003;
                }
                input[type='range']::-ms-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: #111;
                  cursor: pointer;
                  border: 2px solid #fff;
                  box-shadow: 0 0 2px #0003;
                }
                input[type='range']::-webkit-slider-runnable-track {
                  height: 8px;
                  background: #111;
                  border-radius: 4px;
                }
                input[type='range']::-ms-fill-lower {
                  background: #111;
                }
                input[type='range']::-ms-fill-upper {
                  background: #eee;
                }
                input[type='range'] {
                  outline: none;
                }
              `}</style>
              <span className="text-base text-black font-mono min-w-[48px] text-left select-none">
                {duration ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '0:00'}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 50, y: 20 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Designed for Modern Travelers</h2>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 text-overflow-fix">
              Our innovative hoodie was created to solve a common problem faced by budget travelers. Airlines in America
              and Europe offer cheap flights but charge excessive fees for carry-on luggage.
            </p>
            {/* <p className="text-lg mb-6">
              Gate agents often receive financial incentives for charging "oversize" personal item fees, sometimes
              unfairly claiming bags are too large even when they're not.
            </p> */}
            <p className="text-base sm:text-lg text-overflow-fix">
              The Travhalór gives you the freedom to bring what you need without paying extra fees, letting you travel
              smarter and more economically.
            </p>
          </motion.div>
        </div>
      </div>
    </BackgroundOverlay>
  )
}
