"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { motion } from "framer-motion"
import ProductModel from "@/components/product-model"
import { useMobile } from "@/hooks/use-mobile"
import { ChevronUp, ChevronDown } from "lucide-react"

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

export default function ProductFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [hasReachedEnd, setHasReachedEnd] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const nextFeature = () => {
    if (activeFeature < features.length - 1) {
      setActiveFeature(activeFeature + 1)
      setHasReachedEnd(false)
    } else {
      setHasReachedEnd(true)
      // Dispatch custom event to notify parent component
      const event = new Event('productFeaturesTourCompleted');
      window.dispatchEvent(event);
    }
  }

  const prevFeature = () => {
    if (activeFeature > 0) {
      setActiveFeature(activeFeature - 1)
      setHasReachedEnd(false)
    } else if (activeFeature === 0) {
      // At first feature, emit event
      const event = new Event('productFeaturesAtStart');
      window.dispatchEvent(event);
    }
  }

  // Notify parent when we've reached the end of features
  useEffect(() => {
    const handleWheelCapture = (e: WheelEvent) => {
      // If we're at the last feature and scrolling down, allow the event to propagate to the main scroll handler
      if (hasReachedEnd && e.deltaY > 0) {
        return;
      }
      
      // If we're at the first feature and scrolling up, allow the event to propagate to the main scroll handler
      if (activeFeature === 0 && e.deltaY < 0) {
        return;
      }
      
      // Otherwise, handle the scroll within our component
      e.stopPropagation();
      e.preventDefault();
      
      if (e.deltaY > 0) {
        nextFeature();
      } else {
        prevFeature();
      }
    };
    
    const section = sectionRef.current;
    if (section) {
      section.addEventListener('wheel', handleWheelCapture, { capture: true, passive: false });
      return () => section.removeEventListener('wheel', handleWheelCapture, { capture: true });
    }
  }, [activeFeature, hasReachedEnd]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        if (activeFeature < features.length - 1) {
          e.preventDefault()
          nextFeature()
        }
      } else if (e.key === "ArrowUp") {
        if (activeFeature > 0) {
          e.preventDefault()
          prevFeature()
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeFeature])

  // Handle touch events for mobile swipe navigation
  useEffect(() => {
    if (!isMobile) return;
    
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only prevent default if not at bounds
      if ((activeFeature === 0 && touchStartY < e.touches[0].clientY) || 
          (activeFeature === features.length - 1 && touchStartY > e.touches[0].clientY)) {
        // Allow scrolling to prev/next section
        return;
      }
      
      // Prevent default scrolling if we're handling the swipe
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwiping) return;
      
      touchEndY = e.changedTouches[0].clientY;
      const distance = touchStartY - touchEndY;
      
      // If at first feature and swiping down, allow parent to handle
      if (activeFeature === 0 && distance < -minSwipeDistance) {
        // Let main page handle it
        return;
      }
      
      // If at last feature and swiping up, allow parent to handle
      if (activeFeature === features.length - 1 && distance > minSwipeDistance) {
        // Let main page handle it
        return;
      }
      
      if (Math.abs(distance) > minSwipeDistance) {
        isSwiping = true;
        
        if (distance > 0) {
          // Swipe up (next feature)
          nextFeature();
        } else {
          // Swipe down (previous feature)
          prevFeature();
        }
        
        setTimeout(() => {
          isSwiping = false;
        }, 500);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: false });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", handleTouchEnd, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile, activeFeature]);

  return (
    <div ref={sectionRef} className="w-full max-w-[1600px] mx-auto h-full flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-16 text-white">Product Features</h2>

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                key={feature.id}
                className="p-6 rounded-lg"
              >
                <h3 className="text-2xl md:text-4xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-lg md:text-xl text-white">{feature.description}</p>
              </motion.div>
            </div>

            <div className="w-full md:w-1/2 h-[40vh] md:h-[60vh]">
              <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Environment preset="city" />
                <OrbitControls 
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={1.5}
                  enablePan={false}
                />
                <ProductModel
                  position={[0, 0, 0]}
                  scale={1}
                  rotation={[0, Math.PI * 2 * (index / features.length), 0]}
                />
              </Canvas>
            </div>
          </div>
        ))}

        {/* Feature indicator */}
        <div className="absolute bottom-8 left-8 z-10">
          <span className="font-mono text-sm text-white">
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
                activeFeature === index ? "bg-white w-4" : "bg-gray-300"
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
