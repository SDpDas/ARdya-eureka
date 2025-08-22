"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificationProps {
  message: string
  type: "success" | "error" | "info"
}

export function Notification({ message, type }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${getBackgroundColor()} shadow-lg`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
