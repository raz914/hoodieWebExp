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
    <header className="header-bar">
      <div className="header-logo">VHALÓR</div>
      <nav className="header-nav">
        <a className="header-link" href="#hero">Home</a>
        <a className="header-link" href="#about">About</a>
        <a className="header-link" href="#contact">Contact</a>
      </nav>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap');
        .header-bar {
          width: 100%;
          background: var(--background);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem 0 2.5rem;
          height: 64px;
          box-sizing: border-box;
          box-shadow: none;
        }
        .header-logo {
          font-family: 'Poppins', 'Quicksand', Arial, sans-serif;
          font-weight: bold;
          font-size: 2rem;
          letter-spacing: 0.04em;
          color: #222;
          text-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .header-nav {
          display: flex;
          gap: 2.5rem;
        }
        .header-link {
          font-family: 'Poppins', 'Quicksand', Arial, sans-serif;
          font-size: 1.5rem;
          color: #222;
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: color 0.2s;
        }
        .header-link:hover {
          color: #444;
        }
        @media (max-width: 900px) {
          .header-bar { padding: 0 1rem; }
          .header-logo { font-size: 1.3rem; }
          .header-link { font-size: 1rem; }
        }
      `}</style>
    </header>
  )
}
