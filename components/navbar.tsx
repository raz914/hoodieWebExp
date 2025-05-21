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
  
  // Determine if we should use white text based on the current section
  const useWhiteText = currentSection === 'hero' || currentSection === 'contact'

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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/30 backdrop-blur-md shadow-sm" : "bg-transparent",
        useWhiteText && !scrolled ? "text-white" : "text-gray-900"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="#" className={cn("text-xl font-bold", 
          useWhiteText && !scrolled ? "text-white" : "")}>
          TravelHoodie
        </Link>

        {isMobile ? (
          <>
            <button onClick={() => setIsOpen(!isOpen)} className={cn("p-2 focus:outline-none",
              useWhiteText && !scrolled ? "text-white" : "")}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isOpen && (
              <div className="fixed inset-0 top-16 bg-white/80 backdrop-blur-lg z-40 p-6">
                <ul className="flex flex-col gap-6">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium hover:text-gray-600"
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
          <ul className="flex gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "font-medium transition-colors",
                    useWhiteText && !scrolled 
                      ? "text-white hover:text-gray-200" 
                      : "hover:text-gray-600"
                  )}
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
