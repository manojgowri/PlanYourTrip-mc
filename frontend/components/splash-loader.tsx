"use client"

import Lottie from "lottie-react"
import travelLoader from "@/public/lottie/travel-loader.json"
import { motion } from "framer-motion"

export function SplashLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white z-[9999]"
    >
      <Lottie animationData={travelLoader} loop={true} autoplay={true} className="w-64 h-64" />
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl font-bold mt-8"
      >
        Planning Your Adventure...
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-lg mt-2"
      >
        Get ready for an unforgettable journey!
      </motion.p>
    </motion.div>
  )
}
