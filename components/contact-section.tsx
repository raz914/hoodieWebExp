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
    <BackgroundOverlay intensity={overlayIntensity} className="py-16">
      <div ref={ref} className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 20
            }
          } : { opacity: 0, y: 30, scale: 0.9 }}
        >
          Get In Touch
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-1 gap-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { 
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          } : { opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
              }
            } : { opacity: 0, y: 30 }}
          >
            <motion.h3 
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.3 }}
            >
              Contact Information
            </motion.h3>
            <motion.p 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.4 }}
            >
              Have questions about our product or want to place a bulk order? Reach out to us using our contact information below.
            </motion.p>

            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              } : { opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-medium">Email</h4>
                <p>info@vhalor.com</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="font-medium">Phone</h4>
                <p>+1 (555) 123-4567</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.7 }}
              >
                <h4 className="font-medium">Address</h4>
                <p>
                  123 Travel Street
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </BackgroundOverlay>
  )
}
