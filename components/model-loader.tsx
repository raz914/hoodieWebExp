"use client"

import { useEffect, useState } from "react"
import { useGLTF } from "@react-three/drei"

// Extend Window interface to add our global flags
declare global {
  interface Window {
    MODELS_LOADED?: boolean;
    MODELS_FAILED?: boolean;
  }
}

// This component handles preloading 3D models during the loading screen
export default function ModelLoader() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(false)

  useEffect(() => {
    // Attempt to preload the model
    const loadModel = async () => {
      try {
        // Create a new AbortController
        const controller = new AbortController()
        
        // Set a timeout to abort if loading takes too long
        const timeoutId = setTimeout(() => {
          controller.abort()
          console.warn("Model loading timed out, using fallback")
          setLoadingError(true)
          setModelsLoaded(true) // Still mark as "loaded" so app can continue
        }, 10000) // 10 second timeout
        
        // Preload the model (could be expanded to load multiple models)
        await useGLTF.preload("/model/hoodieModel2.glb")
        
        // If we get here, loading succeeded
        clearTimeout(timeoutId)
        console.log("3D model preloaded successfully")
        setModelsLoaded(true)
        
      } catch (error) {
        console.error("Error preloading model:", error)
        setLoadingError(true)
        setModelsLoaded(true) // Still mark as "loaded" so app can continue
      }
    }
    
    loadModel()
    
    // Global flag to indicate model loading status
    window.MODELS_LOADED = false
    window.MODELS_FAILED = false
    
    return () => {
      // Clean up
    }
  }, [])
  
  // Effect to update global state once loading is complete
  useEffect(() => {
    if (modelsLoaded) {
      window.MODELS_LOADED = true
      window.MODELS_FAILED = loadingError
    }
  }, [modelsLoaded, loadingError])

  // This component doesn't render anything
  return null
} 