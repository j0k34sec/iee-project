'use client'

import { motion } from 'framer-motion'

// Fade in animation for sections
export const FadeIn = ({ children, delay = 0, duration = 0.6 }: { 
  children: React.ReactNode
  delay?: number
  duration?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Slide in from left animation
export const SlideInLeft = ({ children, delay = 0, duration = 0.6 }: { 
  children: React.ReactNode
  delay?: number
  duration?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Slide in from right animation
export const SlideInRight = ({ children, delay = 0, duration = 0.6 }: { 
  children: React.ReactNode
  delay?: number
  duration?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Scale in animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5 }: { 
  children: React.ReactNode
  delay?: number
  duration?: number 
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Stagger animation for lists
export const StaggerContainer = ({ children, delay = 0 }: { 
  children: React.ReactNode
  delay?: number 
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay
        }
      }
    }}
  >
    {children}
  </motion.div>
)

export const StaggerItem = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Pulse animation for countdown numbers
export const PulseNumber = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
)

// Hover animation for cards
export const HoverCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2, ease: 'easeOut' }
    }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
)

// Button hover animation
export const AnimatedButton = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

// Enhanced button with initial animation and continuous pulse
export const AnimatedRegisterButton = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ 
      duration: 0.6, 
      delay: 0.7,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 300,
      damping: 20
    }}
    whileHover={{ 
      scale: 1.08,
      transition: { duration: 0.2, ease: 'easeOut' }
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      animate={{ 
        boxShadow: [
          '0 0 0 0 rgba(168, 85, 247, 0.7)',
          '0 0 20px 5px rgba(168, 85, 247, 0.4)',
          '0 0 0 0 rgba(168, 85, 247, 0.7)'
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  </motion.div>
)

// Subtle version with simple entrance animation
export const AnimatedRegisterButtonSubtle = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ 
      duration: 0.8, 
      delay: 0.7,
      ease: 'easeOut'
    }}
    whileHover={{ 
      scale: 1.05,
      transition: { duration: 0.2, ease: 'easeOut' }
    }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.div>
)