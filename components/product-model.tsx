"use client"

import { useRef, useState, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import type * as THREE from "three"

// Preload the model at module level
try {
  useGLTF.preload("/model/hoodieModel.glb")
} catch (error) {
  console.warn("Error preloading model:", error)
}

interface ProductModelProps {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function ProductModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ProductModelProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [modelFailed, setModelFailed] = useState(false)
  
  // Check if model loading failed during initial loading
  useEffect(() => {
    if (window.MODELS_FAILED) {
      setModelFailed(true)
    }
  }, [])
  
  // If we know the model failed, render a fallback shape
  if (modelFailed) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        {/* Fallback shape - a simple hoodie-like form */}
        <mesh>
          <boxGeometry args={[1, 1.5, 0.2]} />
          <meshStandardMaterial color="#3366cc" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3366cc" />
        </mesh>
      </group>
    )
  }
  
  try {
    const { scene } = useGLTF("/model/hoodieModel.glb")

    // Clone the scene to avoid issues with multiple instances
    const clonedScene = scene.clone()
    
    // Set initial rotation
    if (meshRef.current) {
      meshRef.current.rotation.set(rotation[0], rotation[1], rotation[2])
    }

    return (
      <primitive 
        ref={meshRef} 
        object={clonedScene} 
        position={position} 
        scale={scale} 
      />
    )
  } catch (error) {
    console.warn("Error loading model in component:", error)
    // Return a fallback shape
    return (
      <group position={position} scale={scale} rotation={rotation}>
        {/* Fallback shape - a simple hoodie-like form */}
        <mesh>
          <boxGeometry args={[1, 1.5, 0.2]} />
          <meshStandardMaterial color="#3366cc" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#3366cc" />
        </mesh>
      </group>
    )
  }
}
