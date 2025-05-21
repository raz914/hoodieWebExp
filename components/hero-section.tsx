"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, Environment } from "@react-three/drei"
import { motion } from "framer-motion"
import ProductModel from "@/components/product-model"
import { useMobile } from "@/hooks/use-mobile"

export default function HeroSection() {
  const isMobile = useMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Environment preset="city" />
          <PresentationControls
            global
            rotation={[0, -Math.PI / 4, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            {/* <ProductModel position={[0, 0, 0]} scale={isMobile ? 1.5 : 2} /> */}
          </PresentationControls>
        </Canvas>
      </div>

      <div className="z-10 text-center px-4 md:px-0 max-w-3xl">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Travel Without Extra Fees
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The innovative hoodie that lets you carry more without paying for carry-on luggage
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <a
            href="#product"
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Explore Features
          </a>
        </motion.div>
      </div>
    </div>
  )
}
