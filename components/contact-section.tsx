"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import BackgroundOverlay from "./background-overlay"
import { useOverlay } from "@/contexts/overlay-context"

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const { overlayIntensity } = useOverlay()

  return (
    <BackgroundOverlay intensity={overlayIntensity} className="py-0">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-0 md:px-8 flex flex-col md:flex-row min-h-[70vh]"
        style={{ background: 'transparent' }}
      >
        {/* Left Side */}
        <div
          className="flex-1 flex flex-col justify-center items-start bg-black text-white p-8 md:p-16 min-h-[400px]"
          style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
        >
          <h1 style={{ fontSize: '5vw', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '1.5rem', lineHeight: 1 }}>
            VHALÓR
          </h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '2.5rem', fontWeight: 400 }}>
            Travel smart. Travel Light. Travel with Vhalór.
          </p>
          <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.7rem', fontWeight: 500 }}>Follow us</div>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'inherit' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M15.36 8.26h-1.22V7.5c0-.29.19-.36.32-.36h.87V5.5h-1.18c-1.31 0-1.61.98-1.61 1.6v1.16H11v1.76h1.14V18h2.01v-7.98h1.35l.2-1.76z" fill="#222"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'inherit' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6zm4.5-6.1a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0zM17.6 8.1c-.1-.7-.4-1.3-.9-1.8-.5-.5-1.1-.8-1.8-.9-.7-.1-2.7-.1-3.4 0-.7.1-1.3.4-1.8.9-.5.5-.8 1.1-.9 1.8-.1.7-.1 2.7 0 3.4.1.7.4 1.3.9 1.8.5.5 1.1.8 1.8.9.7.1 2.7.1 3.4 0 .7-.1 1.3-.4 1.8-.9.5-.5.8-1.1.9-1.8.1-.7.1-2.7 0-3.4zm-1.1 4.1a2.6 2.6 0 0 1-1.5 1.5c-.4.2-1.3.2-2.1.2s-1.7 0-2.1-.2a2.6 2.6 0 0 1-1.5-1.5c-.2-.4-.2-1.3-.2-2.1s0-1.7.2-2.1a2.6 2.6 0 0 1 1.5-1.5c.4-.2 1.3-.2 2.1-.2s1.7 0 2.1.2a2.6 2.6 0 0 1 1.5 1.5c.2.4.2 1.3.2 2.1s0 1.7-.2 2.1z" fill="#222"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: 'inherit' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M16.23 9.3c-.13-.5-.52-.9-1.02-1.03C14.36 8 12 8 12 8s-2.36 0-3.21.27c-.5.13-.89.53-1.02 1.03C7.5 10.15 7.5 12 7.5 12s0 1.85.27 2.7c.13.5.52.9 1.02 1.03C9.64 16 12 16 12 16s2.36 0 3.21-.27c.5-.13.89-.53 1.02-1.03.27-.85.27-2.7.27-2.7s0-1.85-.27-2.7zM10.75 14.02V9.98l4.02 2.02-4.02 2.02z" fill="#222"/></svg>
              </a>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center items-start bg-[#e6e6e6] text-black p-8 md:p-16 min-h-[400px]">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Contact Details</h2>
          <div style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontWeight: 600 }}>Email:</span> info@vhalor.com
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontWeight: 600 }}>Phone:</span> +1 (555) 123-4567
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>Address:</span><br />
              123 Travel Street<br />
              New York, NY 10001<br />
              United States
            </div>
          </div>
        </div>
      </div>
    </BackgroundOverlay>
  )
}
