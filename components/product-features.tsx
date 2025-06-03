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
      "Discreet pockets let you store essentials like phones and passports.",
    hotspotPosition: [-3.3, 1.2, 0.5] as [number, number, number],
    cameraPosition: [1.8, 2, 2.2] as [number, number, number],
    cameraTarget: [0, 0, 0] as [number, number, number],
  },
  {
    id: 2,
    title: "Expandable Storage",
    description:
      "Expandable sections hold clothing, reducing the need for extra luggage.",
    hotspotPosition: [0, 0.3, 0] as [number, number, number],
    cameraPosition: [0, 0.3, 1.3] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
  },
  {
    id: 3,
    title: "Comfortable Design",
    description:
      "Breathable fabric and ergonomic weight for comfort on long flights.",
    hotspotPosition: [-0.6, 1.3, 0.3] as [number, number, number],
    cameraPosition: [1.4, 1.4, 1.5] as [number, number, number],
    cameraTarget: [0, 0.3, 0] as [number, number, number],
  },
  {
    id: 4,
    title: "Stylish Appearance",
    description:
      "Looks like a normal hoodie while hiding its travel features.",
    hotspotPosition: [0.3, 0, 0.5] as [number, number, number],
    cameraPosition: [-1.4, 0.9, 1.5] as [number, number, number],
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
    gl.domElement.style.pointerEvents = 'none'
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
      <Environment files="/potsdamer_platz_1k.hdr" background />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3/4}
        rotateSpeed={0.5}
        target={[0, 0.3, 0]}
        makeDefault={false}
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
      const now = Date.now()
      const timeDiff = now - lastScrollTime.current
      
      // Check if we're at the boundaries
      if (activeFeature === 0 && e.deltaY < 0) {
        // At first feature, scrolling up - allow normal scroll
        return true
      }
      if (activeFeature === features.length - 1 && e.deltaY > 0) {
        // At last feature, scrolling down - allow normal scroll
        return true
      }
      
      // If we're not at boundaries, handle feature navigation
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
          height: '85vh',
          position: 'relative',
          overflow: 'visible',
          margin: 0,
          padding: 0,
          background: 'transparent',
          touchAction: 'pan-y',
          borderRadius: '2rem',
        }}
        className="md:h-screen"
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
              height: 'calc(100% - 1rem)',
              margin: '0.5rem 0',
              zIndex: 1,
              pointerEvents: 'auto',
              borderRadius: '2rem',
              overflow: 'hidden',
            }}
          >
            <Canvas camera={{ position: features[activeFeature].cameraPosition, fov: 50 }}>
              <Scene activeFeature={activeFeature} onAnimationComplete={handleAnimationComplete} />
            </Canvas>

            {/* Info Panel */}
            {activeFeature < 4 ? (
              <div
                className="info-panel-wrapper"
                style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  zIndex: 10,
                  padding: '1rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
              >
                <InfoPanel
                  isOpen={true}
                  title={features[activeFeature].title}
                  description={features[activeFeature].description}
                  onClose={() => setIsInfoPanelOpen(false)}
                />
              </div>
            ) : null}

            {/* Feature indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
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
                      activeFeature === index ? "bg-white w-8" : "bg-gray-400 w-2"
                    }`}
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </div>
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
      </div>
    </>
  )
}