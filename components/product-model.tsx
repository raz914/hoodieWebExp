"use client"

import { useRef } from "react"
import { useGLTF } from "@react-three/drei"
import type * as THREE from "three"

// Preload the model at module level
useGLTF.preload("/model/hoodieModel.glb")

interface ProductModelProps {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function ProductModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: ProductModelProps) {
  const meshRef = useRef<THREE.Group>(null)
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
}
