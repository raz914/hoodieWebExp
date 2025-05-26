// components/product-features.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import ProductModel from "@/components/product-model"
import InfoPanel from "@/components/info-panel"
import Hotspot3D from "@/components/hotspot-3d"
import { useMobile } from "@/hooks/use-mobile"
import * as THREE from "three"

const features = [
  {
    id: 1,
    title: "Hidden Compartments",
    description:
      "Multiple discreet pockets throughout the hoodie allow you to store essentials like phones, passports, and small items that would normally go in your carry-on bag.",
    hotspotPosition: [-0.3, 0.2, 0.5] as [number, number, number],
    cameraPosition: [-0.8, 0.3, 1.2] as [number, number, number],
    cameraTarget: [-0.3, 0.2, 0] as [number, number, number],
  },
  {
    id: 2,
    title: "Expandable Storage",
    description:
      "Specially designed expandable sections can hold clothing items, reducing the need for additional luggage while maintaining a normal appearance.",
    hotspotPosition: [0, -0.2, 0.6] as [number, number, number],
    cameraPosition: [0, -0.5, 1.5] as [number, number, number],
    cameraTarget: [0, -0.2, 0] as [number, number, number],
  },
  {
    id: 3,
    title: "Comfortable Design",
    description:
      "Despite its storage capabilities, the hoodie remains comfortable to wear during long flights, with breathable fabric and ergonomic weight distribution.",
    hotspotPosition: [0, 0.4, 0.3] as [number, number, number],
    cameraPosition: [0, 0.8, 1.8] as [number, number, number],
    cameraTarget: [0, 0.4, 0] as [number, number, number],
  },
  {
    id: 4,
    title: "Stylish Appearance",
    description:
      "Looks like a normal hoodie to casual observers, including airline staff, while providing the functionality you need to avoid extra baggage fees.",
    hotspotPosition: [0.3, 0, 0.5] as [number, number, number],
    cameraPosition: [1.2, 0.2, 1.4] as [number, number, number],
    cameraTarget: [0.3, 0, 0] as [number, number, number],
  },
]

type CameraControllerProps = {
  position: [number, number, number]
  target: [number, number, number]
  onAnimationComplete?: () => void
}

function CameraController({ position, target, onAnimationComplete }: CameraControllerProps) {
  const { camera } = useThree()
  const targetVector = useRef(new THREE.Vector3(...target))
  const startPosition = useRef(camera.position.clone())
  const startTarget = useRef(targetVector.current.clone())
  const progress = useRef(0)
  const isAnimating = useRef(true)
  
  useEffect(() => {
    // Reset animation when position/target changes
    startPosition.current = camera.position.clone()
    startTarget.current = targetVector.current.clone()
    progress.current = 0
    isAnimating.current = true
  }, [position, target])
  
  useFrame((state, delta) => {
    if (isAnimating.current) {
      // Use easing for smooth animation
      progress.current += delta * 1.5 // Adjust speed as needed
      const easedProgress = 1 - Math.pow(1 - Math.min(progress.current, 1), 3) // Cubic ease-out
      
      // Interpolate camera position
      const endPosition = new THREE.Vector3(...position)
      camera.position.lerpVectors(startPosition.current, endPosition, easedProgress)
      
      // Interpolate look-at target
      const endTarget = new THREE.Vector3(...target)
      targetVector.current.lerpVectors(startTarget.current, endTarget, easedProgress)
      camera.lookAt(targetVector.current)
      
      // Check if animation is complete
      if (progress.current >= 1) {
        isAnimating.current = false
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    }
  })
  
  return null
}

function Scene({ activeFeature, onAnimationComplete }: { activeFeature: number, onAnimationComplete: () => void }) {
  const feature = features[activeFeature]
  
  return (
    <>
      <CameraController 
        position={feature.cameraPosition} 
        target={feature.cameraTarget}
        onAnimationComplete={onAnimationComplete}
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
      
      {/* Product Model */}
      <ProductModel
        position={[0, 0, 0]}
        scale={1}
        rotation={[0, 0, 0]}
      />
      
      {/* Hotspots */}
      {features.map((f, index) => (
        <Hotspot3D
          key={f.id}
          position={f.hotspotPosition}
          isActive={index === activeFeature}
          label={f.title}
        />
      ))}
    </>
  )
}

export default function ProductFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const lastScrollTime = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout>()

  // Handle scroll events with debouncing
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Prevent default only if we're not at the boundaries
      const now = Date.now()
      const timeDiff = now - lastScrollTime.current
      
      // Debounce scroll events
      if (timeDiff < 800 || isAnimating) return
      
      // Check boundaries
      if (activeFeature === features.length - 1 && e.deltaY > 0) {
        // At last feature, scrolling down - allow normal scroll
        return
      }
      if (activeFeature === 0 && e.deltaY < 0) {
        // At first feature, scrolling up - allow normal scroll
        return
      }
      
      e.preventDefault()
      lastScrollTime.current = now
      
      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      
      // Set animating state
      setIsAnimating(true)
      
      // Handle scroll
      if (e.deltaY > 0) {
        // Scroll down
        const nextIndex = Math.min(activeFeature + 1, features.length - 1)
        setActiveFeature(nextIndex)
        
        // Show info panel after a delay
        scrollTimeout.current = setTimeout(() => {
          setIsInfoPanelOpen(true)
        }, 600)
      } else if (e.deltaY < 0) {
        // Scroll up
        const prevIndex = Math.max(activeFeature - 1, 0)
        setActiveFeature(prevIndex)
        
        // Close info panel first, then change
        setIsInfoPanelOpen(false)
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('wheel', handleScroll, { passive: false })
      return () => section.removeEventListener('wheel', handleScroll)
    }
  }, [activeFeature, isAnimating])

  // Handle touch events for mobile
  useEffect(() => {
    if (!isMobile) return

    let touchStartY = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && activeFeature < features.length - 1) {
          // Swipe up
          setActiveFeature(prev => prev + 1)
          setTimeout(() => setIsInfoPanelOpen(true), 600)
        } else if (diff < 0 && activeFeature > 0) {
          // Swipe down
          setIsInfoPanelOpen(false)
          setActiveFeature(prev => prev - 1)
        }
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('touchstart', handleTouchStart)
      section.addEventListener('touchend', handleTouchEnd)
      return () => {
        section.removeEventListener('touchstart', handleTouchStart)
        section.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [activeFeature, isMobile])

  // Handle animation complete
  const handleAnimationComplete = () => {
    setIsAnimating(false)
  }

  // Auto-open info panel when feature changes (except on first load)
  useEffect(() => {
    if (activeFeature > 0 && !isInfoPanelOpen) {
      const timer = setTimeout(() => {
        setIsInfoPanelOpen(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [activeFeature])

  return (
    <div ref={sectionRef} className="w-full h-full relative">
      <div className="absolute top-8 left-8 z-20">
        <h2 className="text-3xl md:text-5xl font-bold text-black">Product Features</h2>
      </div>

      <div ref={containerRef} className="w-full h-full">
        <div className="w-full h-full relative">
          <Canvas camera={{ position: features[0].cameraPosition, fov: 50 }}>
            <Scene activeFeature={activeFeature} onAnimationComplete={handleAnimationComplete} />
          </Canvas>
        </div>

        {/* Feature indicators */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-5xl font-bold text-black">
              {String(activeFeature + 1).padStart(2, "0")}
            </span>
            <span className="text-xl text-gray-600">
              / {String(features.length).padStart(2, "0")}
            </span>
          </div>
          
          {/* Progress dots */}
          <div className="flex items-center space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveFeature(index)
                  if (index > 0) {
                    setTimeout(() => setIsInfoPanelOpen(true), 600)
                  } else {
                    setIsInfoPanelOpen(false)
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeFeature === index ? "bg-black w-8" : "bg-gray-300 w-2"
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        {activeFeature === 0 && (
          <motion.div 
            className="absolute bottom-8 right-8 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4v8m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Info Panel */}
      <InfoPanel
        isOpen={isInfoPanelOpen}
        title={features[activeFeature].title}
        description={features[activeFeature].description}
        onClose={() => setIsInfoPanelOpen(false)}
      />
    </div>
  )
}