// components/info-panel.tsx
"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface InfoPanelProps {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
}

export default function InfoPanel({ isOpen, title, description, onClose }: InfoPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      if (isOpen) {
        panelRef.current.style.right = '0'
      } else {
        panelRef.current.style.right = '-400px'
      }
    }
  }, [isOpen])

  return (
    <div
      ref={panelRef}
      className="info-panel fixed top-0 right-[-300px] w-[260px] h-full transition-all duration-500 ease-in-out z-50 overflow-auto bg-transparent shadow-none backdrop-blur-none"
    >
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg m-4 mt-24">
        <h2 className="text-2xl font-bold text-black mb-2 mt-2">{title}</h2>
        <p className="text-base text-black leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}