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
      className="info-panel fixed top-0 right-[-400px] w-[350px] h-full bg-black/90 backdrop-blur-lg shadow-2xl transition-all duration-500 ease-in-out z-50 overflow-auto"
    >
      <div className="p-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-3xl font-bold text-white mb-2 mt-4">{title}</h2>
        
        <div className="w-16 h-1 bg-blue-500 mb-8 rounded-full" />
        
        <p className="text-lg text-gray-200 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}