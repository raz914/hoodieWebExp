"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useTransform, motion, useSpring, MotionValue } from "framer-motion"
import { useSection } from "@/contexts/section-context"

// Define the section names to match the IDs in the app 
const SECTIONS = ["hero", "video", "product", "about", "contact"]

export default function AirplaneWindowBg() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const { setCurrentSection } = useSection()
  
  // Create a progress motion value that we control directly
  const progressValue = useRef(new MotionValue(0))
  
  // Smoother animation with spring
  const smoothProgress = useSpring(progressValue.current, { 
    stiffness: 60, 
    damping: 30,
    restDelta: 0.001
  })
  
  const [randomOffsets, setRandomOffsets] = useState<number[]>([])
  const [starPositions, setStarPositions] = useState<any[]>([])
  const [contrailPositions, setContrailPositions] = useState<any[]>([])
  
  // Set isClient after mount to handle SSR
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Generate random values only on the client side to avoid hydration mismatches
  useEffect(() => {
    if (!isClient) return;
    
    setRandomOffsets(Array.from({ length: 10 }, () => Math.random() * 30))
    setStarPositions(Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3
    })))
    
    // Generate random positions for airplane contrails
    setContrailPositions(Array.from({ length: 5 }, () => ({
      startX: Math.random() * 20,  // Start position percentage
      y: 15 + Math.random() * 30,  // Height in sky (percentage)
      length: 100 + Math.random() * 200, // Length in pixels
      angle: -5 + Math.random() * 10, // Slight angle variation
      duration: 80 + Math.random() * 100, // Animation duration
      delay: Math.random() * 60, // Random delay for each trail
      opacity: 0.6 + Math.random() * 0.4, // Opacity variation
      width: 1 + Math.random() * 1.5 // Width variation
    })))
  }, [isClient])

  // Set up the intersection observer to track which section is currently visible
  useEffect(() => {
    if (!isClient) return;
    
    const handleSectionChange = (index: number) => {
      setCurrentSectionIndex(index);
      
      // Update the context with current section
      setCurrentSection(SECTIONS[index]);
      
      // Map section index to progress value (0 to 1)
      // Convert index to a value between 0 and 1 based on total sections
      const progress = index / (SECTIONS.length - 1);
      progressValue.current.set(progress);
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex(id => id === entry.target.id);
            if (index !== -1) {
              handleSectionChange(index);
            }
          }
        });
      },
      { threshold: 0.6 } // When 60% of the section is visible
    );
    
    SECTIONS.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    
    return () => {
      SECTIONS.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [isClient]);
  
  // Create a fixed set of transforms that don't depend on randomOffsets
  const cloudTransform0 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform2 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform3 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform4 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform5 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform6 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform7 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform8 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const cloudTransform9 = useTransform(smoothProgress, [0, 1], [0, -100]);
  
  // Put all transforms into an array for easy access
  const cloudTransforms = [
    cloudTransform0, cloudTransform1, cloudTransform2, cloudTransform3, cloudTransform4,
    cloudTransform5, cloudTransform6, cloudTransform7, cloudTransform8, cloudTransform9
  ];
  
  // More distinct color steps for each phase
  const skyColorBase = useTransform(
    smoothProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    [
      "hsl(259, 58.70%, 12.40%)",  // Night/Pre-dawn deep blue/purple (Hero)
      "hsla(35, 67.40%, 16.90%, 0.99)",  // Dawn bright orange/gold (Video start)
      "hsl(200, 90%, 80%)",  // Daytime light blue (Product)
      "hsl(30, 100%, 65%)",  // Sunset orange/gold (About)
      "hsl(260, 60%, 30%)"   // Night deep blue/purple (Contact)
    ]
  )
  
  // Dawn/Dusk gradient overlay - stronger contrast
  const skyColorOverlay = useTransform(
    smoothProgress, 
    [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1], 
    [
      "linear-gradient(to top, rgba(79, 25, 120, 0.4), rgba(20, 20, 80, 0.2))",  // Pre-dawn gradient 
      "linear-gradient(to top, rgba(255, 170, 80, 0.6), rgba(255, 120, 50, 0.3))", // Dawn gradient - stronger
      "linear-gradient(to top, rgba(255, 200, 120, 0.3), rgba(100, 200, 255, 0.1))", // Early day
      "linear-gradient(to bottom, rgba(100, 180, 255, 0.15), rgba(200, 240, 255, 0))", // Full day - lighter
      "linear-gradient(to bottom, rgba(255, 170, 80, 0.5), rgba(255, 120, 50, 0.3))", // Sunset gradient - stronger
      "linear-gradient(to top, rgba(20, 10, 50, 0.6), rgba(40, 20, 80, 0.4))", // Dusk gradient 
      "linear-gradient(to top, rgba(75, 20, 120, 0.4), rgba(20, 20, 80, 0.2))"  // Night gradient
    ]
  )
  
  // Add debug display to show current section
  const [debugProgress, setDebugProgress] = useState(0)
  
  // useEffect(() => {
  //   const unsubscribe = smoothProgress.on("change", v => {
  //     setDebugProgress(v)
  //   })
  //   return unsubscribe
  // }, [smoothProgress])
  
  // Cloud color changes based on time of day - more distinct
  const cloudColor = useTransform(
    smoothProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    [
      "rgba(130, 130, 180, 0.7)",  // Pre-dawn bluish clouds
      "rgba(255, 210, 180, 0.9)",  // Dawn golden clouds - brighter
      "rgba(255, 255, 255, 0.8)",  // Day white clouds
      "rgba(255, 190, 140, 0.9)",  // Sunset orange clouds - brighter
      "rgba(130, 130, 180, 0.7)"   // Night dark bluish clouds
    ]
  )
  
  // Star visibility based on time of day
  const starOpacity = useTransform(
    smoothProgress, 
    [0, 0.15, 0.35, 0.65, 0.85, 1], 
    [0.8, 0, 0, 0, 0.8, 0.8]  // Visible at night and pre-dawn
  )
  
  // Moon visibility based on time of day
  const moonOpacity = useTransform(
    smoothProgress, 
    [0, 0.15, 0.35, 0.65, 0.85, 1], 
    [0.9, 0.2, 0, 0, 0.7, 0.9]  // Visible at night and pre-dawn
  )
  
  // Contrail visibility based on time of day
  const contrailOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    [0.3, 0.5, 0.9, 0.6, 0.4, 0.3] // More visible during day, less at night
  )

  // Pre-calculate cloud positions to avoid hooks in render
  const cloudPositions = useMemo(() => {
    if (!isClient || randomOffsets.length === 0) {
      return Array(10).fill(0).map(() => ({
        width: '120px',
        height: '80px',
        left: '10%',
        top: '10%',
        duration: '60s',
        animationDelay: '0s',
        extraOffset: 0,
        structure: Array(5).fill(0).map(() => ({
          width: '40%',
          height: '30%',
          top: '0%',
          left: '0%',
          borderRadius: '50%',
          opacity: 0.7
        }))
      }));
    }
    
    return Array(10).fill(0).map((_, i) => {
      // Generate a stable structure for this cloud
      const structure = Array(5 + Math.floor(Math.random() * 4))
        .fill(0)
        .map(() => ({
          width: `${40 + Math.random() * 80}%`,
          height: `${30 + Math.random() * 70}%`,
          top: `${Math.random() * 70}%`,
          left: `${Math.random() * 60}%`,
          borderRadius: `${50 + Math.random() * 50}%`,
          opacity: 0.7 + Math.random() * 0.3
        }));

      return {
        // Base cloud position and size
        width: `${120 + Math.random() * 180}px`,
        height: `${80 + Math.random() * 50}px`,
        left: `${(i * 10) + randomOffsets[i]}%`,
        top: `${10 + Math.random() * 70}%`,
        // Give each cloud a different animation duration for natural movement
        duration: `${60 + Math.random() * 60}s`, 
        // Start each cloud at a different position in the animation
        animationDelay: `-${Math.random() * 60}s`,
        // Apply the extra offset based on randomOffsets for visual variety
        extraOffset: randomOffsets[i] ? randomOffsets[i] * 10 : 0,
        // Cloud structure - a collection of circular elements to create a fluffy appearance
        structure
      };
    });
  }, [isClient, randomOffsets]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" ref={containerRef}>
      {/* Base Sky Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          backgroundColor: skyColorBase
        }}
      />
      
      {/* Dawn/Dusk Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: skyColorOverlay
        }}
      />

      {/* Debug display - comment out in production */}
      {/* <div className="fixed bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs z-50">
        Section: {SECTIONS[currentSectionIndex]} ({currentSectionIndex + 1}/{SECTIONS.length})
        <br/>
        Progress: {debugProgress.toFixed(2)}
      </div> */}
      
      {/* Airplane Contrails - Only rendered client-side */}
      {isClient && contrailPositions.length > 0 && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ opacity: contrailOpacity }}
        >
          {contrailPositions.map((trail, i) => (
            <div
              key={`trail-${i}`}
              className="absolute"
              style={{
                top: `${trail.y}%`,
                left: 0,
                width: '100%',
                height: '2px',
                overflow: 'visible',
              }}
            >
              {/* Aircraft blinking light */}
              <div 
                className="absolute z-10"
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  boxShadow: '0 0 3px 2px rgba(255, 255, 255, 0.8)',
                  animation: `moveContrail ${trail.duration}s linear infinite, aircraftLights 6s infinite`,
                  animationDelay: `-${trail.delay}s, -${Math.random() * 6}s`,
                  left: 0,
                  top: '-1px',
                  transform: `translateX(100vw) rotate(${trail.angle}deg)`,
                }}
              />
              
              {/* Contrail */}
              <div
                className="absolute"
                style={{
                  height: `${trail.width}px`,
                  width: `${trail.length}px`,
                  background: 'linear-gradient(to right, white, white 20%, rgba(255,255,255,0.7) 70%, transparent)',
                  opacity: trail.opacity,
                  filter: 'blur(1px)',
                  transform: `rotate(${trail.angle}deg)`,
                  transformOrigin: 'left center',
                  animation: `moveContrail ${trail.duration}s linear infinite`,
                  animationDelay: `-${trail.delay}s`
                }}
              />
            </div>
          ))}
        </motion.div>
      )}
      
      {/* Stars (visible at night) - Only rendered client-side */}
      {isClient && (
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ opacity: starOpacity }}
        >
          {starPositions.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: "white",
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size + 1}px ${star.size/2}px rgba(255, 255, 255, 0.8)`,
                transition: "opacity 0.5s ease-in-out"
              }}
            />
          ))}
        </motion.div>
      )}
      
      {/* Moon - Only rendered client-side */}
      {isClient && (
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-white"
          style={{
            top: "15%",
            right: "15%",
            opacity: moonOpacity,
            boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.5)",
            transform: "rotate(-45deg)"
          }}
        >
          {/* Moon crater details */}
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-gray-100 opacity-80"></div>
          <div className="absolute top-7 left-10 w-3 h-3 rounded-full bg-gray-100 opacity-70"></div>
          <div className="absolute top-9 left-5 w-2 h-2 rounded-full bg-gray-100 opacity-80"></div>
        </motion.div>
      )}
      
      {/* Clouds */}
      <div className="absolute inset-0 w-full h-full">
        {cloudPositions && cloudPositions.length > 0 ? 
          cloudPositions.map((cloud, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: cloud.width,
                height: cloud.height,
                top: cloud.top,
                left: "-20%", 
                x: isClient ? cloudTransforms[i] : 0,
                animation: isClient ? `moveCloud ${cloud.duration} linear infinite` : 'none',
                animationDelay: cloud.animationDelay,
                position: "relative",
                zIndex: 1
              }}
            >
              {/* Multi-part cloud structure with overlapping elements */}
              {cloud.structure && cloud.structure.map((part, j) => {
                // Create a safe default cloud color
                const safeCloudColor = isClient ? 
                  "rgba(255, 255, 255, 0.5)" :  // Reduced opacity from 0.8 to 0.5
                  "rgba(255, 255, 255, 0.5)";
                
                return (
                  <div
                    key={`cloud-${i}-part-${j}`}
                    className="absolute rounded-full filter blur-md"
                    style={{
                      backgroundColor: safeCloudColor,
                      width: part.width,
                      height: part.height,
                      top: part.top,
                      left: part.left,
                      borderRadius: part.borderRadius,
                      opacity: isClient ? Math.min(part.opacity * 0.7, 0.5) : 0.4  // Further reduced opacity
                    }}
                  />
                );
              })}
            </motion.div>
          ))
        : 
          // Fallback basic clouds if there's an issue with cloudPositions
          Array(5).fill(0).map((_, i) => (
            <div 
              key={`fallback-cloud-${i}`}
              className="absolute rounded-full filter blur-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",  // Reduced opacity from 0.8 to 0.5
                width: `${100 + (i * 20)}px`,
                height: "50px",
                top: `${10 + (i * 15)}%`,
                left: `${(i * 20)}%`,
                opacity: 0.4  // Reduced opacity from 0.7 to 0.4
              }}
            />
          ))
        }
      </div>
      
      {/* Add keyframe animations */}
      <style jsx global>{`
        @keyframes moveCloud {
          0% {
            transform: translateX(120vw); /* Start from right side off-screen */
          }
          100% {
            transform: translateX(-20vw); /* Move to left side off-screen */
          }
        }
        
        @keyframes moveContrail {
          0% {
            transform: translateX(100vw) rotate(${Math.random() * 5 - 2.5}deg);
            opacity: 0;
          }
          5% {
            opacity: var(--opacity, 0.8);
          }
          95% {
            opacity: var(--opacity, 0.8);
          }
          100% {
            transform: translateX(-120vw) rotate(${Math.random() * 5 - 2.5}deg);
            opacity: 0;
          }
        }
        
        @keyframes blinkLight {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes aircraftLights {
          0%, 100% { 
            background-color: white;
            box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.8);
            opacity: 1;
          }
          25% {
            background-color: #FF0000;
            box-shadow: 0 0 3px 2px rgba(255, 0, 0, 0.8);
            opacity: 0.9;
          }
          33% {
            opacity: 0.4;
          }
          50% {
            background-color: #00FF00;
            box-shadow: 0 0 3px 2px rgba(0, 255, 0, 0.8);
            opacity: 0.9;
          }
          58% {
            opacity: 0.4;
          }
          75% {
            background-color: white;
            box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.8);
            opacity: 0.9;
          }
          83% {
            opacity: 0.4;
          }
        }
      `}</style>
      
      {/* Airplane Window Frame */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-full border-[40px] md:border-[80px] rounded-[50%] border-neutral-800 opacity-5" />
      </div> */}
    </div>
  )
} 