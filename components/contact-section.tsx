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
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { overlayIntensity } = useOverlay()

  return (
    <BackgroundOverlay intensity={overlayIntensity} className="py-16">
      <div ref={ref} className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-10 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-1 gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-white">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p className="mb-6">
              Have questions about our product or want to place a bulk order? Reach out to us using our contact information below.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Email</h4>
                <p>info@travelhoodie.com</p>
              </div>

              <div>
                <h4 className="font-medium">Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>

              <div>
                <h4 className="font-medium">Address</h4>
                <p>
                  123 Travel Street
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>
            </div>
          </div>

          {/* Form removed */}
        </motion.div>
      </div>
    </BackgroundOverlay>
  )
}
