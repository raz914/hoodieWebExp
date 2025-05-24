"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useSection } from "@/contexts/section-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isMobile = useMobile()
  const { currentSection, isLoading } = useSection()
  
  // Always use white text regardless of section
  const useWhiteText = true

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // Only add the event listener client-side
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  const menuItems = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#product" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]

  // Don't render navbar when loading
  if (isLoading) {
    return null
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 sm:px-6 py-3 sm:py-4",
        scrolled ? "bg-white/30 backdrop-blur-md shadow-sm" : "bg-transparent",
        "text-white" // Always use white text
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="#" className="text-lg sm:text-xl font-bold text-white">
          TravelHoodie
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 focus:outline-none text-white"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
              <div className="fixed inset-0 top-14 bg-black/90 backdrop-blur-lg z-40 flex flex-col justify-start pt-8">
                <ul className="flex flex-col gap-6 px-6">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-white hover:text-gray-200 block py-2"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <ul className="flex gap-6 md:gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className="font-medium transition-colors text-white hover:text-gray-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}
