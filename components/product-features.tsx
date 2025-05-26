"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import ProductModel from "@/components/product-model"
import { useMobile } from "@/hooks/use-mobile"
import { ChevronUp, ChevronDown } from "lucide-react"
import * as THREE from "three"

const features = [
  {
    id: 1,
    title: "Hidden Compartments",
    description:
      "Multiple discreet pockets throughout the hoodie allow you to store essentials like phones, passports, and small items that would normally go in your carry-on bag.",
  },
  {
    id: 2,
    title: "Expandable Storage",
    description:
      "Specially designed expandable sections can hold clothing items, reducing the need for additional luggage while maintaining a normal appearance.",
  },
  {
    id: 3,
    title: "Comfortable Design",
    description:
      "Despite its storage capabilities, the hoodie remains comfortable to wear during long flights, with breathable fabric and ergonomic weight distribution.",
  },
  {
    id: 4,
    title: "Stylish Appearance",
    description:
      "Looks like a normal hoodie to casual observers, including airline staff, while providing the functionality you need to avoid extra baggage fees.",
  },
]

// Camera hotspots for each feature (approximate, adjust as needed)
const cameraHotspots: { position: [number, number, number]; target: [number, number, number] }[] = [
  { position: [0, 0, 2], target: [0, 0, 0] }, // Full hoodie
  { position: [-0.5, -0.2, 0.8], target: [-0.5, -0.2, 0] }, // Left pocket
  { position: [0, 0.2, 0.8], target: [0, 0.5, 0] }, // Chest/upper
  { position: [0.5, -0.2, 0.8], target: [0.5, -0.2, 0] }, // Right pocket
]

type CameraControllerProps = {
  position: [number, number, number]
  target: [number, number, number]
}

function CameraController({ position, target }: CameraControllerProps) {
  const { camera } = useThree()
  const targetVector = useRef(new THREE.Vector3(...target))
  
  useEffect(() => {
    // Animate camera position and target
    const animateCamera = async () => {
      const duration = 1000 // 1 second animation
      const startTime = Date.now()
      const startPosition = camera.position.clone()
      const startTarget = targetVector.current.clone()
      const endPosition = new THREE.Vector3(...position)
      const endTarget = new THREE.Vector3(...target)

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease progress with smooth easing
        const easedProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out

        // Interpolate position
        camera.position.lerpVectors(startPosition, endPosition, easedProgress)
        
        // Interpolate target
        targetVector.current.lerpVectors(startTarget, endTarget, easedProgress)
        camera.lookAt(targetVector.current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    animateCamera()
  }, [position, target, camera])
  
  return null
}

export default function ProductFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  // Handle scroll events
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // If at last feature and scrolling down, allow scroll to propagate
      if (activeFeature === features.length - 1 && e.deltaY > 0) return;
      // If at first feature and scrolling up, allow scroll to propagate
      if (activeFeature === 0 && e.deltaY < 0) return;

      e.preventDefault();
      setActiveFeature(prev => {
        if (e.deltaY > 0) {
          return Math.min(prev + 1, features.length - 1);
        } else if (e.deltaY < 0) {
          return Math.max(prev - 1, 0);
        }
        return prev;
      });
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleScroll, { passive: false });
      return () => section.removeEventListener('wheel', handleScroll);
    }
  }, [activeFeature]);

  return (
    <div ref={sectionRef} className="w-full max-w-[1600px] mx-auto h-full flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-16">Product Features</h2>

      <div 
        ref={containerRef} 
        className="w-full max-w-7xl mx-auto px-4 md:px-6 relative h-[70vh] md:h-[65vh] overflow-hidden rounded-lg"
      >
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`absolute inset-0 flex ${
              isMobile ? "flex-col" : "md:flex-row"
            } items-center gap-6 md:gap-16 transition-opacity duration-500`}
            style={{
              opacity: activeFeature === index ? 1 : 0,
              pointerEvents: activeFeature === index ? "auto" : "none",
            }}
          >
            <div className="w-full md:w-1/2 px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, x: -100, scale: 0.9, rotateY: -15 }}
                animate={isInView && activeFeature === index ? { 
                  opacity: 1, 
                  x: 0, 
                  scale: 1,
                  rotateY: 0,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2
                  }
                } : { opacity: 0, x: -100, scale: 0.9, rotateY: -15 }}
                key={feature.id}
                className="p-6 rounded-lg"
              >
                <motion.h3 
                  className="text-2xl md:text-4xl font-bold mb-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView && activeFeature === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.4 
                  }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-lg md:text-xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView && activeFeature === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.6 
                  }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            </div>

            <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh]">
              <Canvas camera={{ position: cameraHotspots[activeFeature].position, fov: 50 }}>
                <CameraController 
                  position={cameraHotspots[activeFeature].position} 
                  target={cameraHotspots[activeFeature].target} 
                />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Environment preset="city" />
                <OrbitControls 
                  enableZoom={false}
                  autoRotate={activeFeature === 0}
                  autoRotateSpeed={1.5}
                  enablePan={false}
                />
                <ProductModel
                  position={[0, 0, 0]}
                  scale={1}
                  rotation={[0, Math.PI * 2 * (activeFeature / features.length), 0]}
                />
              </Canvas>
            </div>
          </div>
        ))}

        {/* Feature indicator */}
        <div className="absolute bottom-8 left-8 z-10">
          <span className="font-mono text-sm text-black">
            {String(activeFeature + 1).padStart(2, "0")} / {String(features.length).padStart(2, "0")}
          </span>
        </div>
        
        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-10">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeFeature === index ? "bg-black w-4" : "bg-black/30"
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
