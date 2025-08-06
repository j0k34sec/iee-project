'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface EnhancedCardProps {
  children: React.ReactNode
  className?: string
  hoverScale?: number
  glowColor?: string
}

export default function EnhancedCard({ 
  children, 
  className = '', 
  hoverScale = 1.05,
  glowColor = 'rgba(139, 92, 246, 0.3)'
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <div
      className={`relative transition-all duration-500 ease-out ${className}`}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg) scale(${hoverScale})`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        boxShadow: isHovered
          ? `0 20px 40px ${glowColor}, 0 0 60px ${glowColor}`
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="h-full border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 bg-black/40 backdrop-blur-sm">
        {children}
      </Card>
      
      {/* Animated border effect */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.4), transparent)`,
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: 'exclude',
          padding: '1px',
          opacity: isHovered ? 1 : 0
        }}
      />
    </div>
  )
}

// Enhanced card components
export function EnhancedCardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <CardHeader className={className}>
      {children}
    </CardHeader>
  )
}

export function EnhancedCardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <CardTitle className={`text-purple-300 ${className}`}>
      {children}
    </CardTitle>
  )
}

export function EnhancedCardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <CardDescription className={`text-purple-200 ${className}`}>
      {children}
    </CardDescription>
  )
}

export function EnhancedCardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <CardContent className={className}>
      {children}
    </CardContent>
  )
}