'use client'

import { motion } from 'framer-motion'

interface AnimatedBubbleProps {
  size?: number
  color?: string
  className?: string
  delay?: number
  duration?: number
}

export function AnimatedBubble({
  size = 100,
  color = 'bg-mint-300/20',
  className = '',
  delay = 0,
  duration = 6,
}: AnimatedBubbleProps) {
  return (
    <motion.div
      className={`absolute bubble-shape backdrop-blur-3xl ${color} ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}
