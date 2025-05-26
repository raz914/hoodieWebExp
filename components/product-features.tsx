// components/product-features.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import ProductModel from "@/components/product-model"
import InfoPanel from "@/components/info-panel"
import { useMobile } from "@/hooks/use-mobile"
import * as THREE from "three"

const features = [
  {
    id: 1,
    title: "Hidden Compartments",
    description:
      "Multiple discreet pockets throughout the hoodie allow you to store essentials like phones, passports, and small items that would normally go in your carry-on bag.",
    hotspotPosition: [-3.3, 1.2, 0.5] as [number, number, number],
    cameraPosition: [1.8, 2, 2.2] as [number, number, number],
    cameraTarget: [0, 0, 0] as [number, number, number],
  },
  {
    id: 2,
    title: "Expandable Storage",
    description:
      "Specially designed expandable sections can hold clothing items, reducing the need for additional luggage while maintaining a normal appearance.",
    hotspotPosition: [0, 0.3, 0] as [number, number, number],
    cameraPosition: [0, 0.3, 1.3] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
  },
  {
    id: 3,
    title: "Comfortable Design",
    description:
      "Despite its storage capabilities, the hoodie remains comfortable to wear during long flights, with breathable fabric and ergonomic weight distribution.",
    hotspotPosition: [-0.6, 1.3, 0.3] as [number, number, number],
    cameraPosition: [1.4, 1.4, 1.5] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
  },
  {
    id: 4,
    title: "Stylish Appearance",
    description:
      "Looks like a normal hoodie to casual observers, including airline staff, while providing the functionality you need to avoid extra baggage fees.",
    hotspotPosition: [0.3, 0, 0.5] as [number, number, number],
    cameraPosition: [-1.4, 0.9, 1.5] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
  },
  {
    id: 5,
    title: "360° View",
    description:
      "Explore the hoodie from every angle. Click and drag to rotate the view and see all the innovative features from any perspective.",
    hotspotPosition: [0, 0.3, 0] as [number, number, number],
    cameraPosition: [0, 0.3, 1.6] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
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
        // Set final position and target
        camera.position.copy(endPosition)
        targetVector.current.copy(endTarget)
        camera.lookAt(targetVector.current)
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    } else {
      // Maintain target even after animation
      camera.lookAt(targetVector.current)
    }
  })
  
  return null
}

function Scene({ activeFeature, onAnimationComplete }: { activeFeature: number, onAnimationComplete: () => void }) {
  const feature = features[activeFeature]
  const model = useGLTF("/stage.glb")
  const [bakedMap] = useLoader(THREE.TextureLoader, ["/stage_baked.jpg"])
  const { camera, gl } = useThree()
  
  useEffect(() => {
    bakedMap.flipY = false
    model.scene.traverse((item) => {
      if ((item as THREE.Mesh).isMesh) {
        const mesh = item as THREE.Mesh
        if (mesh.name === "Emissive") {
          mesh.material = new THREE.MeshBasicMaterial()
        } else {
          mesh.material = new THREE.MeshBasicMaterial({ map: bakedMap })
        }
      }
    })
  }, [bakedMap, model.scene])

  // Reset camera position when switching to orbit mode
  useEffect(() => {
    if (activeFeature === 4) {
      camera.position.set(0, 0.3, 2)
      camera.lookAt(0, 0.3, 0)
      // Ensure the canvas can receive pointer events
      gl.domElement.style.pointerEvents = 'auto'
    } else {
      gl.domElement.style.pointerEvents = 'none'
    }
  }, [activeFeature, camera, gl])
  
  return (
    <>
      {activeFeature !== 4 && (
        <CameraController 
          position={feature.cameraPosition} 
          target={feature.cameraTarget}
          onAnimationComplete={onAnimationComplete}
        />
      )}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={activeFeature === 4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3/4}
        rotateSpeed={0.5}
        target={[0, 0.3, 0]}
        makeDefault={activeFeature === 4}
        domElement={gl.domElement}
      />
      
      {/* Stage Model */}
      <primitive object={model.scene} />
      
      {/* Product Model */}
      <ProductModel
        position={[0, 0.4, 0]}
        scale={1.2}
        rotation={[0, 0, 0]}
      />
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
      
      // Reduce debounce time from 800ms to 300ms for more responsive scrolling
      // if (timeDiff < 300 || isAnimating) return
      
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
      
      // Handle scroll with reduced animation time
      if (e.deltaY > 0) {
        // Scroll down
        const nextIndex = Math.min(activeFeature + 1, features.length - 1)
        setActiveFeature(nextIndex)
        
        // Show info panel immediately
        setIsInfoPanelOpen(true)
      } else if (e.deltaY < 0) {
        // Scroll up
        const prevIndex = Math.max(activeFeature - 1, 0)
        setActiveFeature(prevIndex)
        
        // Close info panel immediately
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
          setIsInfoPanelOpen(true)
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
      setIsInfoPanelOpen(true)
    }
  }, [activeFeature])

  return (
    <>
      <style>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          background: transparent !important;
        }
      `}</style>
      <div
        ref={sectionRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          background: 'transparent',
          touchAction: 'none', // Prevent default touch actions
        }}
      >
        {/* <div className="absolute top-8 left-8 z-20">
          <h2 className="text-3xl md:text-5xl font-bold text-black">Product Features</h2>
        </div> */}

        <div ref={containerRef} className="w-full h-full">
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: 'calc(100vh - 2rem)', 
              margin: '1rem 0', 
              zIndex: 1, // Raise z-index so canvas is above background but below info panel
              pointerEvents: 'auto',
            }}
          >
            <Canvas camera={{ position: features[activeFeature].cameraPosition, fov: 50 }}>
              <Scene activeFeature={activeFeature} onAnimationComplete={handleAnimationComplete} />
            </Canvas>
          </div>

          {/* Feature indicators */}
          <div className="absolute bottom-20 left-8 z-20">
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
                      setIsInfoPanelOpen(true)
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

        {/* Info Panel or 360 badge */}
        {activeFeature < 4 ? (
          <div
            className="info-panel-wrapper"
            style={{ position: 'absolute', top: 32, right: 32, left: 'auto', bottom: 'auto', zIndex: 10, transform: 'none' }}
          >
            <InfoPanel
              isOpen={true}
              title={features[activeFeature].title}
              description={features[activeFeature].description}
              onClose={() => setIsInfoPanelOpen(false)}
            />
            <style>{`
              @media (max-width: 640px) {
                .info-panel-wrapper {
                  top: 48vh !important;
                  bottom: 2vh !important;
                  left: 55% !important;
                  right: auto !important;
                  transform: translateX(-50%) !important;
                  width: 92vw;
                  max-width: 360px;
                  display: flex;
                  justify-content: center;
                  align-items: flex-end;
                  z-index: 10;
                  padding-bottom: 8px;
                }
              }
              @media (max-width: 400px) {
                .info-panel-wrapper {
                  width: 98vw;
                  max-width: 98vw;
                  font-size: 0.95rem;
                }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ position: 'absolute', bottom: 80, right: 32, zIndex: 10 }}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              borderRadius: '1rem',
              padding: '0.5rem 1.25rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}>
              360° View
            </div>
          </div>
        )}
      </div>
    </>
  )
}