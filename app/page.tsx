"use client"
import { useState, useEffect, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Navbar from "@/components/navbar"
// import SectionNav from "@/components/section-nav" // Removed as requested
import HeroSection from "@/components/hero-section"
import VideoSection from "@/components/video-section"
import ProductFeatures from "@/components/product-features"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  const isMobile = useMobile()
  const [isClient, setIsClient] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [productFeaturesCompleted, setProductFeaturesCompleted] = useState(false)
  const [isAtProductFirstFeature, setIsAtProductFirstFeature] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  const sections = ["hero", "video", "product", "about", "contact"]

  // Track scroll progress for time-of-day styling
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const totalHeight = container.scrollHeight - container.clientHeight;
      // Ensure progress is properly calculated
      const progress = Math.min(Math.max(container.scrollTop / totalHeight, 0), 1);
      setScrollProgress(progress);
      
      // For debugging
      console.log('Scroll progress:', progress);
    };
    
    // Initialize on mount
    setTimeout(() => {
      if (mainElement) {
        const totalHeight = mainElement.scrollHeight - mainElement.clientHeight;
        const progress = Math.min(Math.max(mainElement.scrollTop / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    }, 100);
    
    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [mainRef]);
  
  // Determine if we're in dark or light mode based on scroll position
  const isDarkMode = (scrollProgress < 0.15 || scrollProgress > 0.7)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listen for custom events from ProductFeatures
  useEffect(() => {
    const handleProductFeaturesCompleted = () => {
      setProductFeaturesCompleted(true);
    };
    
    const handleProductFeaturesAtStart = () => {
      setIsAtProductFirstFeature(true);
    };

    window.addEventListener('productFeaturesTourCompleted', handleProductFeaturesCompleted);
    window.addEventListener('productFeaturesAtStart', handleProductFeaturesAtStart);
    
    return () => {
      window.removeEventListener('productFeaturesTourCompleted', handleProductFeaturesCompleted);
      window.removeEventListener('productFeaturesAtStart', handleProductFeaturesAtStart);
    };
  }, []);

  // Reset productFeaturesCompleted when leaving product section
  useEffect(() => {
    if (currentSectionIndex !== sections.indexOf("product")) {
      setProductFeaturesCompleted(false);
    }
  }, [currentSectionIndex, sections]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip this handling for the product section as it has its own handler
      const productSection = document.getElementById('product');
      const target = e.target as Node;
      if (productSection && productSection.contains(target)) {
        // Let ProductFeatures handle it
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1)
        setCurrentSectionIndex(nextIndex)
        document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: "smooth" })
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        const prevIndex = Math.max(currentSectionIndex - 1, 0)
        setCurrentSectionIndex(prevIndex)
        document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSectionIndex, sections])

  // Handle wheel scrolling
  useEffect(() => {
    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      // Check if the event came from the product features section
      const productSection = document.getElementById('product');
      if (productSection && productSection.contains(e.target as Node)) {
        // If on product section:
        // 1. If scrolling down but not at end, let ProductFeatures handle it
        // 2. If scrolling up but not at start, let ProductFeatures handle it
        if ((!productFeaturesCompleted && e.deltaY > 0) || 
            (!isAtProductFirstFeature && e.deltaY < 0)) {
          return;
        }
        // Reset states when needed
        if (isAtProductFirstFeature && e.deltaY < 0) {
          setIsAtProductFirstFeature(false);
        }
        if (productFeaturesCompleted && e.deltaY > 0) {
          setProductFeaturesCompleted(false);
        }
      }
      
      if (isScrolling) return;
      
      isScrolling = true;
      e.preventDefault();
      
      if (e.deltaY > 0) {
        // Scroll down
        const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
        setCurrentSectionIndex(nextIndex);
        document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: "smooth" });
      } else {
        // Scroll up
        const prevIndex = Math.max(currentSectionIndex - 1, 0);
        setCurrentSectionIndex(prevIndex);
        document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: "smooth" });
      }
      
      // Prevent multiple scrolls
      setTimeout(() => {
        isScrolling = false;
      }, 1000); // Adjust timeout as needed for smooth scrolling
    };
    
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [currentSectionIndex, sections, productFeaturesCompleted, isAtProductFirstFeature]);

  // Update current section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.findIndex(id => id === entry.target.id)
            if (index !== -1) {
              setCurrentSectionIndex(index)
            }
          }
        })
      },
      { threshold: 0.6 }
    )

    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      sections.forEach(id => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [isClient, sections])

  // Handle touch events for swipe navigation
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Check if the event came from the product features section
      const productSection = document.getElementById('product');
      if (productSection && productSection.contains(e.target as Node)) {
        // If in product section, let the component handle its internal touch events
        return;
      }
      
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Check if the event came from the product features section
      const productSection = document.getElementById('product');
      if (productSection && productSection.contains(e.target as Node)) {
        // In product section - let it handle it
        return;
      }
      
      // Prevent default to disable native scrolling
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Check if the event came from the product features section
      const productSection = document.getElementById('product');
      if (productSection && productSection.contains(e.target as Node)) {
        // Handle specific cases:
        // 1. If at first feature and swiping up, navigate to previous section
        // 2. If at last feature and swiping down, navigate to next section
        if ((isAtProductFirstFeature && e.changedTouches[0].clientY > touchStartY + minSwipeDistance) || 
            (productFeaturesCompleted && e.changedTouches[0].clientY < touchStartY - minSwipeDistance)) {
          // Reset states
          if (isAtProductFirstFeature) setIsAtProductFirstFeature(false);
          if (productFeaturesCompleted) setProductFeaturesCompleted(false);
        } else {
          // Otherwise let the product component handle it
          return;
        }
      }
      
      if (isSwiping) return;
      
      touchEndY = e.changedTouches[0].clientY;
      const distance = touchStartY - touchEndY;
      
      if (Math.abs(distance) > minSwipeDistance) {
        isSwiping = true;
        
        if (distance > 0) {
          // Swipe up (go down)
          const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
          setCurrentSectionIndex(nextIndex);
          document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: "smooth" });
        } else {
          // Swipe down (go up)
          const prevIndex = Math.max(currentSectionIndex - 1, 0);
          setCurrentSectionIndex(prevIndex);
          document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: "smooth" });
        }
        
        setTimeout(() => {
          isSwiping = false;
        }, 1000);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement && isMobile) {
      mainElement.addEventListener("touchstart", handleTouchStart, { passive: false });
      mainElement.addEventListener("touchmove", handleTouchMove, { passive: false });
      mainElement.addEventListener("touchend", handleTouchEnd, { passive: false });
    }

    return () => {
      if (mainElement && isMobile) {
        mainElement.removeEventListener("touchstart", handleTouchStart);
        mainElement.removeEventListener("touchmove", handleTouchMove);
        mainElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentSectionIndex, sections, isMobile, isAtProductFirstFeature, productFeaturesCompleted]);

  if (!isClient) {
    return null // Return null on server-side to prevent hydration errors
  }

  return (
    <div className="relative w-full">
      <Navbar />
      {/* SectionNav removed as requested */}
      
      <main ref={mainRef} className="snap-container">
        <section 
          id="hero" 
          className={`snap-section ${scrollProgress < 0.15 ? 'night-section' : ''}`}
        >
          <HeroSection />
        </section>

        <section 
          id="video" 
          className={`snap-section ${scrollProgress > 0.15 && scrollProgress < 0.4 ? 'day-section' : 
                                     scrollProgress >= 0.4 && scrollProgress < 0.7 ? 'sunset-section' : 
                                     'night-section'}`}
        >
          <VideoSection />
        </section>

        <section 
          id="product" 
          className={`snap-section ${scrollProgress >= 0.4 && scrollProgress < 0.7 ? 'sunset-section' : 
                                     scrollProgress >= 0.7 ? 'night-section' : 'day-section'}`}
        >
          <ProductFeatures />
        </section>

        <section 
          id="about" 
          className={`snap-section ${scrollProgress >= 0.7 ? 'night-section' : 'sunset-section'}`}
        >
          <AboutSection />
        </section>

        <section 
          id="contact" 
          className="snap-section night-section"
        >
          <ContactSection />
        </section>
      </main>
    </div>
  )
}
