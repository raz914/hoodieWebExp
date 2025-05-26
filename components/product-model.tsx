"use client"

import { useRef, useMemo } from "react"
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
  let scene: THREE.Group | null = null
  let error = null

  try {
    // This will throw if the model fails to load
    const gltf = useGLTF("/model/hoodieModel.glb")
    scene = useMemo(() => gltf.scene.clone(), [gltf.scene])
  } catch (e) {
    error = e
  }

  if (error || !scene) {
    // Fallback shape
    return (
      <group position={position} scale={scale} rotation={rotation}>
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

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      position={position} 
      scale={scale} 
      rotation={rotation} 
    />
  )
}
